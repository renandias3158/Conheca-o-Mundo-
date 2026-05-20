import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { api, getAllCountries, normalizeCountry } from '../api';

const FAVORITES_KEY = '@favorites';

export default function FavoritesScreen({ navigation }) {
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const loadCountries = useCallback(async () => {
    try {
      const response = await api.get(getAllCountries);
      const normalized = response.data.map(normalizeCountry).sort((a, b) => a.name.localeCompare(b.name));
      setCountries(normalized);
    } catch (error) {
      console.log(error);
      setCountries([]);
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

  const removeFavorite = async (code) => {
    try {
      const updated = favorites.filter((item) => item !== code);
      setFavorites(updated);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.log(error);
    }
  };

  const items = countries.filter((item) => favorites.includes(item.code));

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate('Details', { code: item.code })}
    >
      <Image source={{ uri: item.flag }} style={styles.thumb} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>Capital: {item.capital}</Text>
      </View>

      <Pressable onPress={() => removeFavorite(item.code)} hitSlop={12}>
        <AntDesign name="heart" size={20} color="#e03131" />
      </Pressable>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Favoritos</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Você ainda não favoritou nenhum país.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f8ff' },
  header: { backgroundColor: '#1462e0', padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  list: { padding: 16 },
  empty: { textAlign: 'center', marginTop: 20, color: '#5d6c86' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eef2f8',
  },
  thumb: { width: 78, height: 52, borderRadius: 10, marginRight: 12, backgroundColor: '#eef3ff' },
  name: { fontSize: 16, fontWeight: '800', color: '#102a5c' },
  meta: { color: '#5d6c86', marginTop: 3 },
});