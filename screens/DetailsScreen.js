import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { api, formatPopulation, getCountryByCode, normalizeCountry } from '../api';

const FAVORITES_KEY = '@favorites';

export default function DetailsScreen({ route }) {
  const { code } = route.params;

  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(FAVORITES_KEY);
      setFavorites(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const loadCountry = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(getCountryByCode(code));
      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      setCountry(normalizeCountry(data));
    } catch (error) {
      console.log(error);
      setCountry(null);
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    loadCountry();
    loadFavorites();
  }, [loadCountry, loadFavorites]);

  const toggleFavorite = async () => {
    try {
      const current = favorites;
      const updated = current.includes(country.code)
        ? current.filter((item) => item !== country.code)
        : [...current, country.code];

      setFavorites(updated);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1462e0" />
      </SafeAreaView>
    );
  }

  if (!country) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.empty}>Não foi possível carregar os detalhes.</Text>
      </SafeAreaView>
    );
  }

  const isFav = favorites.includes(country.code);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.hero}>
          <Image source={{ uri: country.flag }} style={styles.heroImage} />
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{country.name}</Text>
          <Text style={styles.subtitle}>{country.officialName}</Text>

          <View style={styles.rowStats}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{country.capital}</Text>
              <Text style={styles.statLabel}>Capital</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatPopulation(country.population)}</Text>
              <Text style={styles.statLabel}>População</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Line label="Região" value={country.region} />
            <Line label="Sub-região" value={country.subregion} />
            <Line label="Continente" value={country.continent} />
            <Line label="Moeda(s)" value={country.currencies} />
            <Line label="Idioma(s)" value={country.languages} />
            <Line label="Fuso horário" value={country.timezones} />
          </View>

          <Pressable style={styles.button} onPress={toggleFavorite}>
            <AntDesign name={isFav ? 'heart' : 'hearto'} size={18} color="#fff" />
            <Text style={styles.buttonText}>
              {isFav ? ' Remover dos Favoritos' : ' Adicionar aos Favoritos'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Line({ label, value }) {
  return (
    <View style={styles.line}>
      <Text style={styles.lineLabel}>{label}</Text>
      <Text style={styles.lineValue}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f8ff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f8ff' },
  empty: { color: '#5d6c86' },
  hero: { height: 220, backgroundColor: '#dfeaff' },
  heroImage: { width: '100%', height: '100%' },
  body: { padding: 16 },
  title: { fontSize: 28, fontWeight: '900', color: '#102a5c' },
  subtitle: { color: '#5d6c86', marginTop: 4, marginBottom: 16 },
  rowStats: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eef2f8',
  },
  statValue: { fontWeight: '800', color: '#102a5c', textAlign: 'center' },
  statLabel: { color: '#5d6c86', marginTop: 5, fontSize: 12 },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eef2f8',
  },
  line: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f8',
  },
  lineLabel: { color: '#5d6c86', fontWeight: '700', flex: 1 },
  lineValue: { color: '#102a5c', fontWeight: '700', flex: 1, textAlign: 'right' },
  button: {
    marginTop: 16,
    backgroundColor: '#1462e0',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: { color: '#fff', fontWeight: '800' },
});