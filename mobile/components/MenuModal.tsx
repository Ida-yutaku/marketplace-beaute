import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function MenuModal({ visible, onClose, isDarkMode, onToggleTheme }: MenuModalProps) {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path as any);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.drawerContainer} onPress={(e) => e.stopPropagation()}>
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

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleNavigate('/vendeuse-info')}
              >
                <Ionicons name="bag-handle-outline" size={20} color="#FF69B4" />
                <Text style={styles.menuItemText}>Je suis vendeuse</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleNavigate('/acheteuse-info')}
              >
                <Ionicons name="heart-outline" size={20} color="#FF69B4" />
                <Text style={styles.menuItemText}>Je suis acheteuse</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>PRÉFÉRENCES</Text>

              {/* Bouton Toggle Mode Clair / Sombre */}
              <TouchableOpacity style={styles.menuItem} onPress={onToggleTheme}>
                <Ionicons 
                  name={isDarkMode ? "sunny-outline" : "moon-outline"} 
                  size={20} 
                  color="#FF69B4" 
                />
                <Text style={styles.menuItemText}>
                  {isDarkMode ? "Mode clair" : "Mode sombre"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer avec Boutons d'accès rapide */}
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.outlineButton} 
                onPress={() => handleNavigate('/login')}
              >
                <Text style={styles.outlineButtonText}>Connexion</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.filledButton} 
                onPress={() => handleNavigate('/register')}
              >
                <Text style={styles.filledButtonText}>Créer un compte</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  drawerContainer: {
    width: '80%',
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