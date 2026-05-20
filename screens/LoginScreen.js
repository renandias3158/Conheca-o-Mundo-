import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const entrar = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.circle}>
            <Ionicons name="earth" size={90} color="#1462e0" />
          </View>

          <Text style={styles.title}>CONHEÇA O MUNDO</Text>
          <Text style={styles.subtitle}>Explore. Descubra. Viaje.</Text>

          <View style={styles.inputBox}>
            <Feather name="mail" size={18} color="#7d8796" />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#7d8796"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputBox}>
            <Feather name="lock" size={18} color="#7d8796" />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#7d8796"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          <Pressable style={styles.button} onPress={entrar} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Register')} style={styles.linkRow}>
            <Text style={styles.linkMuted}>Ainda não tem conta?</Text>
            <Text style={styles.link}> Cadastre-se</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f8ff' },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: 20,
    elevation: 3,
  },
  title: { textAlign: 'center', fontSize: 26, fontWeight: '900', color: '#102a5c' },
  subtitle: { textAlign: 'center', fontSize: 15, color: '#5d6c86', marginTop: 6, marginBottom: 24 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5eaf3',
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 14,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: '#102a5c' },
  button: {
    backgroundColor: '#1462e0',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  linkMuted: { color: '#5d6c86' },
  link: { color: '#1462e0', fontWeight: '700' },
});