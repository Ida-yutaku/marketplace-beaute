import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  FadeInRight,
  Easing,
} from 'react-native-reanimated';
import AnimatedButton from './AnimatedButton';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const DRAWER_WIDTH = Dimensions.get('window').width * 0.8;

export default function MenuModal({ visible, onClose, isDarkMode, onToggleTheme }: MenuModalProps) {
  const router = useRouter();
  const translateX = useSharedValue(DRAWER_WIDTH);
  const overlayOpacity = useSharedValue(0);

  // Piloté par Reanimated plutôt que par le "fade" natif de Modal : le
  // tiroir glisse depuis la droite avec un léger ressort, et se referme en
  // glissant à nouveau plutôt que de disparaître d'un coup.
  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(1, { duration: 220 });
      translateX.value = withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) });
    } else {
      translateX.value = withTiming(DRAWER_WIDTH, { duration: 240, easing: Easing.in(Easing.cubic) });
      overlayOpacity.value = withDelay(80, withTiming(0, { duration: 200 }));
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));
  const drawerStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path as any);
  };

  return (
    <Modal visible={visible} animationType="none" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.overlayBg, overlayStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.drawerContainer, { width: DRAWER_WIDTH }, drawerStyle]}>
          <SafeAreaView style={styles.safeArea}>
            {/* Header du Menu */}
            <View style={styles.header}>
              <Text style={styles.menuTitle}>MENU</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Content / Links */}
            <View style={styles.menuContent}>
              <Text style={styles.sectionTitle}>ESPACES DÉDIÉS</Text>

              {visible && (
                <Animated.View entering={FadeInRight.delay(60).duration(300).springify().damping(16)}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigate('/vendeuse-info')}
                  >
                    <Ionicons name="bag-handle-outline" size={20} color="#FF69B4" />
                    <Text style={styles.menuItemText}>Je suis vendeuse</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}

              {visible && (
                <Animated.View entering={FadeInRight.delay(110).duration(300).springify().damping(16)}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigate('/acheteuse-info')}
                  >
                    <Ionicons name="heart-outline" size={20} color="#FF69B4" />
                    <Text style={styles.menuItemText}>Je suis acheteuse</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>PRÉFÉRENCES</Text>

              {visible && (
                <Animated.View entering={FadeInRight.delay(160).duration(300).springify().damping(16)}>
                  <TouchableOpacity style={styles.menuItem} onPress={onToggleTheme}>
                    <Ionicons
                      name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                      size={20}
                      color="#FF69B4"
                    />
                    <Text style={styles.menuItemText}>
                      {isDarkMode ? 'Mode clair' : 'Mode sombre'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>

            {/* Footer avec Boutons d'accès rapide */}
            {visible && (
              <Animated.View entering={FadeInRight.delay(210).duration(300).springify().damping(16)} style={styles.footer}>
                <AnimatedButton
                  style={styles.outlineButton}
                  onPress={() => handleNavigate('/login')}
                >
                  <Text style={styles.outlineButtonText}>Connexion</Text>
                </AnimatedButton>

                <AnimatedButton
                  style={styles.filledButton}
                  onPress={() => handleNavigate('/register')}
                >
                  <Text style={styles.filledButtonText}>Créer un compte</Text>
                </AnimatedButton>
              </Animated.View>
            )}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  overlayBg: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  drawerContainer: {
    height: '100%',
    backgroundColor: '#0F0814',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#2A173B',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A173B',
  },
  menuTitle: {
    color: '#FF69B4',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  closeButton: {
    padding: 4,
  },
  menuContent: {
    flex: 1,
    paddingTop: 24,
  },
  sectionTitle: {
    color: '#7A6B8A',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A173B',
    marginVertical: 20,
  },
  footer: {
    gap: 12,
    paddingTop: 16,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#342145',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  filledButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  filledButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
