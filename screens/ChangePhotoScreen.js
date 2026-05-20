import React from 'react';
import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

const AVATAR_KEY = '@avatar';

export default function ChangePhotoScreen({ navigation }) {
  const escolherGaleria = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return Alert.alert('Permissão negada', 'É preciso permitir acesso à galeria.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await AsyncStorage.setItem(AVATAR_KEY, result.assets[0].uri);
      Alert.alert('Sucesso', 'Foto atualizada!');
      navigation.goBack();
    }
  };

  const tirarFoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      return Alert.alert('Permissão negada', 'É preciso permitir acesso à câmera.');
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await AsyncStorage.setItem(AVATAR_KEY, result.assets[0].uri);
      Alert.alert('Sucesso', 'Foto atualizada!');
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Alterar Foto</Text>
        <Text style={styles.subtitle}>Escolha uma imagem para o perfil.</Text>

        <View style={styles.previewWrap}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
            }}
            style={styles.preview}
          />
          <View style={styles.badge}>
            <Feather name="camera" size={16} color="#fff" />
          </View>
        </View>

        <Pressable style={styles.buttonOutline} onPress={escolherGaleria}>
          <Feather name="image" size={18} color="#1462e0" />
          <Text style={styles.buttonOutlineText}> Escolher da Galeria</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={tirarFoto}>
          <Feather name="camera" size={18} color="#fff" />
          <Text style={styles.buttonText}> Tirar Foto</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f8ff' },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '900', color: '#102a5c' },
  subtitle: { color: '#5d6c86', marginTop: 6, marginBottom: 18 },
  previewWrap: { alignSelf: 'center', width: 180, height: 180, marginBottom: 20, alignItems: 'center', justifyContent: 'center' },
  preview: { width: 170, height: 170, borderRadius: 85, backgroundColor: '#eef3ff' },
  badge: {
    position: 'absolute',
    right: 8,
    bottom: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1462e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1462e0',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  buttonOutlineText: { color: '#1462e0', fontWeight: '800' },
  button: {
    backgroundColor: '#1462e0',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: { color: '#fff', fontWeight: '800' },
});