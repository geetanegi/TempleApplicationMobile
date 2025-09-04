// components/MusicCard.js
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

export default function MusicCard({item, isActive}) {
  return (
    <TouchableOpacity style={[styles.card, isActive && styles.activeCard]}>
      <Image source={{uri: item.image}} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={[styles.name, isActive && styles.activeName]}>
          {item.title}
        </Text>
        <Text style={styles.musicBy}>Music By : {item.musicBy}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  activeCard: {
    backgroundColor: '#ff7f32',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activeName: {
    color: '#fff',
  },
  musicBy: {
    fontSize: 12,
    color: '#666',
  },
});
