import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MenuModal from '../components/MenuModal';

export default function HomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <SafeAreaView style={[styles.container, !isDarkMode && styles.lightContainer]}>
      {/* Header avec icône Mascara / Beauté */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <View style={styles.smallLogoCircle}>
            <Text style={styles.smallLogoText}>S</Text>
          </View>
          <Text style={[styles.headerTitle, !isDarkMode && styles.lightText]}>
            She's
          </Text>
        </View>

        {/* Bouton du menu mascara */}
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
          <Ionicons name="sparkles" size={20} color="#FF69B4" />
        </TouchableOpacity>
      </View>

      {/* Contenu de la Landing Page */}
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✦ SOINS • COSMÉTIQUES • BEAUTÉ</Text>
        </View>

        <Text style={[styles.heroTitle, !isDarkMode && styles.lightText]}>
          Sublimez,{'\n'}
          <Text style={styles.heroHighlight}>vendez, gagnez</Text>{'\n'}
          en toute simplicité.
        </Text>

        <Text style={[styles.description, !isDarkMode && styles.lightDesc]}>
          La plateforme conçue pour valoriser vos produits de beauté et connecter les passionnées.
        </Text>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/register' as any)}>
            <Text style={styles.primaryButtonText}>Rejoindre l'aventure →</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/login' as any)}>
            <Text style={[styles.secondaryButtonText, !isDarkMode && styles.lightText]}>J'ai déjà un compte</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Composant du Tiroir de Menu */}
      <MenuModal 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0814' },
  lightContainer: { backgroundColor: '#F9F5F8' },
  lightText: { color: '#1A0B2E' },
  lightDesc: { color: '#66587A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  smallLogoCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1F112B', borderWidth: 1, borderColor: '#FF69B4', alignItems: 'center', justifyContent: 'center' },
  smallLogoText: { color: '#FF69B4', fontWeight: 'bold', fontSize: 16 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  menuButton: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#1F112B', borderWidth: 1, borderColor: '#342145', alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
  badge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255, 105, 180, 0.12)', borderWidth: 1, borderColor: 'rgba(255, 105, 180, 0.3)', marginBottom: 28 },
  badgeText: { color: '#FF69B4', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  heroTitle: { fontSize: 34, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', lineHeight: 44, marginBottom: 16 },
  heroHighlight: { color: '#FF69B4' },
  description: { fontSize: 15, color: '#C4B5FD', textAlign: 'center', lineHeight: 22, marginBottom: 40, paddingHorizontal: 10 },
  actionContainer: { width: '100%', gap: 14 },
  primaryButton: { backgroundColor: '#FF69B4', paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secondaryButton: { backgroundColor: 'transparent', paddingVertical: 16, borderRadius: 30, alignItems: 'center', borderWidth: 1.5, borderColor: '#342145' },
  secondaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});