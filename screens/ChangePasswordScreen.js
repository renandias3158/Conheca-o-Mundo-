import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { auth } from '../firebase';

export default function ChangePasswordScreen({ navigation }) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  const alterar = async () => {
    if (novaSenha.length < 6) {
      return Alert.alert('Atenção', 'A nova senha deve ter pelo menos 6 caracteres.');
    }

    if (novaSenha !== confirmar) {
      return Alert.alert('Atenção', 'As senhas não coincidem.');
    }

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user?.email) throw new Error('Usuário não autenticado');

      const credential = EmailAuthProvider.credential(user.email, senhaAtual);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, novaSenha);

      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Alterar Senha</Text>
        <Text style={styles.subtitle}>Confirme sua senha atual para continuar.</Text>

        <Input icon="lock" placeholder="Senha atual" value={senhaAtual} onChangeText={setSenhaAtual} secureTextEntry />
        <Input icon="lock" placeholder="Nova senha" value={novaSenha} onChangeText={setNovaSenha} secureTextEntry />
        <Input icon="lock" placeholder="Confirmar nova senha" value={confirmar} onChangeText={setConfirmar} secureTextEntry />

        <Pressable style={styles.button} onPress={alterar} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar nova senha'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Input({ icon, ...props }) {
  return (
    <View style={styles.inputBox}>
      <Feather name={icon} size={18} color="#7d8796" />
      <TextInput style={styles.input} placeholderTextColor="#7d8796" {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f8ff' },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
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
});