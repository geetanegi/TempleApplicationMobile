// components/MusicCard.js
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export default function VideoCard({item, isActive}) {
  return (
    <TouchableOpacity style={[styles.card, isActive && styles.activeCard]}>
      <Image source={{uri: item.thumbnail}} style={styles.avatar} />
      <View style={styles.textContainer}>
        <EvilIcons name="play" color="#000" size={36} />
        <View>
          <Text style={[styles.name, isActive && styles.activeName]}>
            {item.title}
          </Text>

          <Text style={styles.musicBy}>Video By : {item.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    gap: 4,
  },
  activeCard: {
    backgroundColor: '#ff7f32',
  },
  avatar: {
    width: '100%',
    borderRadius: 10,
    marginRight: 12,
    aspectRatio: 16 / 9,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
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
