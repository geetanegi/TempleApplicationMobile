import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COLORS = {
  bg: '#F5F3EF',
  text: '#1B1B1B',
  sub: '#6B6B6B',
  accent: '#D48A4A',
};

/**
 * Placeholder screen for sidebar items. Shows title and "Coming soon".
 * Route params: { title } (optional; defaults to "Settings")
 */
export default function PlaceholderScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const title = route.params?.title ?? 'Settings';

  return (
    <SafeAreaView style={styles.wrapper} edges={['top']}>
      <View style={styles.container}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={12}
        >
          <Icon name="arrow-back" size={26} color={COLORS.text} />
        </Pressable>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Coming soon</Text>
          <Text style={styles.message}>
            This section is under development and will be available in a future update.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    marginBottom: 16,
  },
  message: {
    fontSize: 15,
    color: COLORS.sub,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});
