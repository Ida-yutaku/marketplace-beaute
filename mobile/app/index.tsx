import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header / Navbar */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <View style={styles.smallLogoCircle}>
            <Text style={styles.smallLogoText}>MB</Text>
          </View>
          <Text style={styles.headerTitle}>
            Marketplace <Text style={{ color: '#FF69B4' }}>Beauté</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>
        {/* Badge supérieur */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            ✦ SOINS • COSMÉTIQUES • PARFUMS
          </Text>
        </View>

        {/* Titre principal */}
        <Text style={styles.heroTitle}>
          Sublimez,{'\n'}
          <Text style={styles.heroHighlight}>vendez, gagnez</Text>{'\n'}
          en toute simplicité.
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          La plateforme conçue pour valoriser vos produits de beauté, connecter les passionnés et développer votre activité.
        </Text>

        {/* Boutons d'action */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/register' as any)}
          >
            <Text style={styles.primaryButtonText}>Rejoindre l'aventure  →</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/login' as any)}
          >
            <Text style={styles.secondaryButtonText}>J'ai déjà un compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0814',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smallLogoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1F112B',
    borderWidth: 1,
    borderColor: '#FF69B4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallLogoText: {
    color: '#FF69B4',
    fontWeight: 'bold',
    fontSize: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1F112B',
    borderWidth: 1,
    borderColor: '#342145',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(233, 30, 99, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.3)',
    marginBottom: 28,
  },
  badgeText: {
    color: '#FF69B4',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 16,
  },
  heroHighlight: {
    color: '#FF69B4',
  },
  description: {
    fontSize: 15,
    color: '#C4B5FD',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  actionContainer: {
    width: '100%',
    gap: 14,
  },
  primaryButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#342145',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});