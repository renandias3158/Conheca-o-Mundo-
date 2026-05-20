import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const FAVORITES_KEY = '@favorites';
const AVATAR_KEY = '@avatar';

export default function ProfileScreen({ navigation }) {
  const [avatarUri, setAvatarUri] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const [avatarRaw, favRaw] = await Promise.all([
        AsyncStorage.getItem(AVATAR_KEY),
        AsyncStorage.getItem(FAVORITES_KEY),
      ]);

      setAvatarUri(avatarRaw || null);
      setFavoritesCount(favRaw ? JSON.parse(favRaw).length : 0);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const sair = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const visitedCount = Math.max(1, Math.floor(favoritesCount * 0.8));
  const reviewsCount = Math.max(1, Math.floor(favoritesCount * 0.6));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Perfil</Text>
        <Feather name="user" size={20} color="#fff" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatarWrap}>
            <Image
              source={{
                uri:
                  avatarUri ||
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
              }}
              style={styles.avatar}
            />
          </View>

          <Text style={styles.name}>{auth.currentUser?.displayName || 'João da Silva'}</Text>
          <Text style={styles.email}>{auth.currentUser?.email || 'joao@email.com'}</Text>

          <View style={styles.statsRow}>
            <Box label="Favoritos" value={favoritesCount} />
            <Box label="Países visitados" value={visitedCount} />
            <Box label="Resenhas" value={reviewsCount} />
          </View>
        </View>

        <View style={styles.menu}>
          <Option label="Alterar Foto" icon="camera" onPress={() => navigation.navigate('ChangePhoto')} />
          <Option label="Alterar Senha" icon="lock" onPress={() => navigation.navigate('ChangePassword')} />
          <Option label="Sair" icon="log-out" danger onPress={sair} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Box({ label, value }) {
  return (
    <View style={styles.box}>
      <Text style={styles.boxValue}>{value}</Text>
      <Text style={styles.boxLabel}>{label}</Text>
    </View>
  );
}

function Option({ icon, label, onPress, danger }) {
  return (
    <Pressable style={styles.option} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Feather name={icon} size={18} color={danger ? '#e03131' : '#102a5c'} />
        <Text style={[styles.optionText, danger && { color: '#e03131' }]}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={danger ? '#e03131' : '#8090a8'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f8ff' },
  header: {
    backgroundColor: '#1462e0',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  content: { padding: 16, paddingBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eef2f8',
  },
  avatarWrap: { width: 120, height: 120, borderRadius: 60, overflow: 'hidden', marginBottom: 12 },
  avatar: { width: '100%', height: '100%' },
  name: { fontSize: 22, fontWeight: '900', color: '#102a5c' },
  email: { marginTop: 4, color: '#5d6c86' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 18, width: '100%' },
  box: {
    flex: 1,
    backgroundColor: '#f7f9ff',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#edf1f8',
  },
  boxValue: { color: '#102a5c', fontWeight: '900' },
  boxLabel: { color: '#5d6c86', fontSize: 12, marginTop: 4, textAlign: 'center' },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginTop: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#eef2f8',
  },
  option: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f8',
  },
  optionText: { marginLeft: 12, fontWeight: '700', color: '#102a5c' },
});