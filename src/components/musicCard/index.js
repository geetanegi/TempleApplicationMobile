// components/MusicCard.js
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

export default function MusicCard({ item, isActive }) {
  const navigate = useNavigation();
  const handlePress = () => {
    navigate.navigate('ViewPDF', { pdfUrl: item.pdfUrl });
  };
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        isActive && styles.activeCard,
        pressed && styles.cardPressed,
      ]}
    >
      <Image source={{ uri: item.artwork }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={[styles.name, isActive && styles.activeName]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.musicBy, isActive && styles.activeMusicBy]} numberOfLines={1}>
          By {item.artist}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#D48A4A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.92,
  },
  activeCard: {
    backgroundColor: '#D48A4A',
    borderLeftColor: 'rgba(255,255,255,0.5)',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B1B1B',
  },
  activeName: {
    color: '#fff',
  },
  musicBy: {
    fontSize: 13,
    color: '#7A7A7A',
    marginTop: 2,
  },
  activeMusicBy: {
    color: 'rgba(255,255,255,0.9)',
  },
});
