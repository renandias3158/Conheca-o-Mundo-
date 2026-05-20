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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  const cadastrar = async () => {
    if (!nome.trim()) return Alert.alert('Atenção', 'Digite seu nome.');
    if (senha.length < 6) return Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
    if (senha !== confirmar) return Alert.alert('Atenção', 'As senhas não coincidem.');

    try {
      setLoading(true);
      const credencial = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      await updateProfile(credencial.user, { displayName: nome });
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
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
          <Pressable onPress={() => navigation.goBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color="#102a5c" />
          </Pressable>

          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>

          <View style={styles.inputBox}>
            <Feather name="user" size={18} color="#7d8796" />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#7d8796"
              value={nome}
              onChangeText={setNome}
            />
          </View>

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

          <View style={styles.inputBox}>
            <Feather name="lock" size={18} color="#7d8796" />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor="#7d8796"
              value={confirmar}
              onChangeText={setConfirmar}
              secureTextEntry
            />
          </View>

          <Pressable style={styles.button} onPress={cadastrar} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
          </Pressable>

          <Pressable onPress={() => navigation.goBack()} style={styles.linkRow}>
            <Text style={styles.linkMuted}>Já tem conta?</Text>
            <Text style={styles.link}> Faça login</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f8ff' },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: { fontSize: 28, fontWeight: '900', color: '#102a5c' },
  subtitle: { color: '#5d6c86', marginTop: 6, marginBottom: 22 },
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
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  linkMuted: { color: '#5d6c86' },
  link: { color: '#1462e0', fontWeight: '700' },
});