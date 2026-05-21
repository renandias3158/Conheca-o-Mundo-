import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { api, getAllCountries, normalizeCountry } from '../api';

const FAVORITES_KEY = '@favorites';

export default function MenuScreen({ navigation }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);

  const loadCountries = useCallback(async () => {
    try {
      setLoading(true);
      console.log(getAllCountries);
      const response = await api.get(getAllCountries);
      const normalized = response.data.map(normalizeCountry).sort((a, b) => a.name.localeCompare(b.name));
      setCountries(normalized);
    } catch (error) {
      console.log(error);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(FAVORITES_KEY);
      setFavorites(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const toggleFavorite = async (code) => {
    try {
      const current = favorites;
      const updated = current.includes(code)
        ? current.filter((item) => item !== code)
        : [...current, code];

      setFavorites(updated);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.log(error);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countries;

    return countries.filter((item) =>
      [item.name, item.capital, item.region, item.continent].some((field) =>
        field?.toLowerCase().includes(q)
      )
    );
  }, [countries, search]);

  const renderItem = ({ item }) => {
    const isFav = favorites.includes(item.code);

    return (
      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate('Details', { code: item.code })}
      >
        <Image source={{ uri: item.flag }} style={styles.flag} />

        <View style={styles.textArea}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>Capital: {item.capital}</Text>
          <Text style={styles.metaSmall}>
            {item.region} • {item.continent}
          </Text> 
        </View>

        <Pressable onPress={() => toggleFavorite(item.code)} hitSlop={12}>
          <AntDesign name={isFav ? 'heart' : 'heart'} size={20} color={isFav ? '#e03131' : '#8090a8'} />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Países</Text>
        <Feather name="bell" size={22} color="#fff" />
      </View>

      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#7d8796" />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar país..."
          placeholderTextColor="#7d8796"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1462e0" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.code}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum país encontrado.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f8ff' },
  header: {
    backgroundColor: '#1462e0',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  searchBox: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -18,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5eaf3',
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#102a5c' },
  list: { padding: 16, paddingBottom: 22 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eef2f8',
  },
  flag: { width: 64, height: 42, borderRadius: 10, backgroundColor: '#eef3ff' },
  textArea: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '800', color: '#102a5c' },
  meta: { color: '#5d6c86', marginTop: 3 },
  metaSmall: { color: '#8090a8', marginTop: 2, fontSize: 12 },
  empty: { textAlign: 'center', color: '#5d6c86', marginTop: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});