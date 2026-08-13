import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* Conteneur Logo Cercle */}
      <View style={styles.logoCircle}>
        {/* Remplace par ton image : require('../assets/icon.png') */}
        <Text style={styles.logoText}>MB</Text>
      </View>

      {/* Titre & Slogan */}
      <Text style={styles.title}>
        Marketplace <Text style={styles.titleHighlight}>Beauté</Text>
      </Text>
      <Text style={styles.subtitle}>RÉVÉLEZ VOTRE ÉCLAT</Text>

      {/* Barre de chargement/accentuation */}
      <View style={styles.loadingBar} />

      {/* Version en bas */}
      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0814', // Fond sombre élégant aux sous-tons violets/roses
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1F112B',
    borderWidth: 2,
    borderColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  titleHighlight: {
    color: '#FF69B4',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B39DDB',
    letterSpacing: 2,
    marginBottom: 32,
  },
  loadingBar: {
    width: 48,
    height: 4,
    backgroundColor: '#FF69B4',
    borderRadius: 2,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: '#7A6B8A',
  },
});