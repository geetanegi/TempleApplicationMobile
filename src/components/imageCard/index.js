// components/MusicCard.js
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {useNavigation} from '@react-navigation/native';
const {width} = Dimensions.get('screen');
export default function ImageCard({item, isActive}) {
  const navigater = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        // navigater.navigate('', item);
      }}
      style={[styles.card, isActive && styles.activeCard]}>
      <Image source={{uri: item.imageUrl}} style={styles.avatar} />
      <View style={styles.textContainer}>
        <View>
          <Text style={[styles.name, isActive && styles.activeName]}>
            {item.title}
          </Text>

          <Text style={styles.musicBy}> {item.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 8,
    margin: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    gap: 4,
    width: width * 0.45,
  },
  activeCard: {
    backgroundColor: '#ff7f32',
  },
  avatar: {
    width: '100%',
    borderRadius: 10,
    marginRight: 12,
    aspectRatio: 9 / 9,
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
