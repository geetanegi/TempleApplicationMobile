import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Image, Film } from 'lucide-react-native';

const COLORS = {
  orange: '#D48A4A',
  text: '#1B1B1B',
  sub: '#7A7A7A',
  bg: '#FFFFFF',
  cardBg: '#F8F6F4',
  iconBg: '#F0EAE4',
};

export default function CreateContentChoiceScreen() {
  const navigation = useNavigation();

  const handleCreatePost = () => {
    navigation.goBack();
    navigation.getParent()?.navigate('Home', { screen: 'CreatePost' });
  };

  const handlePostReel = () => {
    navigation.goBack();
    navigation.getParent()?.navigate('Video', {
      screen: 'PostReel',
      params: { fromProfile: true },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Choose what you want to share</Text>

        <View style={styles.optionsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.optionCard,
              pressed && styles.optionCardPressed,
            ]}
            onPress={handleCreatePost}
          >
            <View style={styles.iconWrap}>
              <Image size={56} color={COLORS.orange} strokeWidth={2} />
            </View>
            <Text style={styles.optionTitle}>Create a Post</Text>
            <Text style={styles.optionSubtext}>
              Share photos or videos with a caption
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.optionCard,
              pressed && styles.optionCardPressed,
            ]}
            onPress={handlePostReel}
          >
            <View style={styles.iconWrap}>
              <Film size={56} color={COLORS.orange} strokeWidth={2} />
            </View>
            <Text style={styles.optionTitle}>Post a Reel</Text>
            <Text style={styles.optionSubtext}>
              Create a short video reel
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.sub,
    fontWeight: '500',
    marginBottom: 28,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'column',
    gap: 16,
  },
  optionCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardPressed: {
    opacity: 0.9,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  optionSubtext: {
    fontSize: 14,
    color: COLORS.sub,
    fontWeight: '500',
  },
});
