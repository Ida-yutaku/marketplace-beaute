import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AcheteuseInfoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Espace Acheteuse</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✦ UN CHOIX INFINI</Text>
        </View>

        <Text style={styles.title}>Comment ça marche pour les acheteuses ?</Text>

        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>01</Text>
          <View style={styles.stepTextContent}>
            <Text style={styles.stepTitle}>Explorez le catalogue</Text>
            <Text style={styles.stepDesc}>Découvrez des pépites beauté, soins et maquillages soigneusement sélectionnés par nos vendeuses.</Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>02</Text>
          <View style={styles.stepTextContent}>
            <Text style={styles.stepTitle}>Commandez en sécurité</Text>
            <Text style={styles.stepDesc}>Bénéficiez d'un paiement protégé. L'argent n'est versé qu'une fois votre commande reçue.</Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>03</Text>
          <View style={styles.stepTextContent}>
            <Text style={styles.stepTitle}>Faites-vous livrer chez vous</Text>
            <Text style={styles.stepDesc}>Suivez l'acheminement de votre colis en temps réel jusqu'à votre porte.</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/register' as any)}>
          <Text style={styles.primaryButtonText}>Créer mon compte acheteuse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/login' as any)}>
          <Text style={styles.secondaryButtonText}>J'ai déjà un compte</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0814' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { padding: 4 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  content: { padding: 24 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, backgroundColor: 'rgba(255, 105, 180, 0.15)', marginBottom: 16 },
  badgeText: { color: '#FF69B4', fontSize: 11, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 24, lineHeight: 36 },
  stepCard: { flexDirection: 'row', backgroundColor: '#1F112B', padding: 18, borderRadius: 16, marginBottom: 16, gap: 16, alignItems: 'center' },
  stepNumber: { fontSize: 22, fontWeight: '800', color: '#FF69B4' },
  stepTextContent: { flex: 1 },
  stepTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  stepDesc: { color: '#C4B5FD', fontSize: 13, lineHeight: 18 },
  footer: { padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: '#1F112B' },
  primaryButton: { backgroundColor: '#FF69B4', paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secondaryButton: { backgroundColor: 'transparent', paddingVertical: 14, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: '#342145' },
  secondaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});