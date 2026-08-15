import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import MenuModal from '../components/MenuModal';
import AnimatedButton from '../components/AnimatedButton';

export default function HomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Le petit logo du header "respire" doucement en continu — un détail qui
  // rend l'écran vivant sans distraire.
  const breathe = useSharedValue(0);
  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);
  const logoBreatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breathe.value * 0.06 }],
  }));

  // Le bouton du menu (icône sparkles) fait une petite rotation à l'ouverture.
  const sparkleRotate = useSharedValue(0);
  function openMenu() {
    sparkleRotate.value = withSequence(
      withTiming(1, { duration: 220, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 220 })
    );
    setMenuVisible(true);
  }
  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotate.value * 25}deg` }, { scale: 1 + sparkleRotate.value * 0.15 }],
  }));

  return (
    <SafeAreaView style={[styles.container, !isDarkMode && styles.lightContainer]}>
      {/* Header avec icône Mascara / Beauté */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <View style={styles.brandContainer}>
          <Animated.View style={[styles.smallLogoCircle, logoBreatheStyle]}>
            <Text style={styles.smallLogoText}>S</Text>
          </Animated.View>
          <Text style={[styles.headerTitle, !isDarkMode && styles.lightText]}>
            She's
          </Text>
        </View>

        {/* Bouton du menu mascara */}
        <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
          <Animated.View style={sparkleStyle}>
            <Ionicons name="sparkles" size={20} color="#FF69B4" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Contenu de la Landing Page */}
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(80).duration(500).springify().damping(16)} style={styles.badge}>
          <Text style={styles.badgeText}>✦ SOINS • COSMÉTIQUES • BEAUTÉ</Text>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(180).duration(550).springify().damping(16)}
          style={[styles.heroTitle, !isDarkMode && styles.lightText]}
        >
          Sublimez,{'\n'}
          <Text style={styles.heroHighlight}>vendez, gagnez</Text>{'\n'}
          en toute simplicité.
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(300).duration(550).springify().damping(16)}
          style={[styles.description, !isDarkMode && styles.lightDesc]}
        >
          La plateforme conçue pour valoriser vos produits de beauté et connecter les passionnées.
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(420).duration(550).springify().damping(16)} style={styles.actionContainer}>
          <AnimatedButton style={styles.primaryButton} onPress={() => router.push('/register' as any)}>
            <Text style={styles.primaryButtonText}>Rejoindre l'aventure →</Text>
          </AnimatedButton>

          <AnimatedButton style={styles.secondaryButton} onPress={() => router.push('/login' as any)}>
            <Text style={[styles.secondaryButtonText, !isDarkMode && styles.lightText]}>J'ai déjà un compte</Text>
          </AnimatedButton>
        </Animated.View>
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
