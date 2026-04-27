import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {LEGAL_DOCUMENTS, LEGAL_META} from '../../legal/legalContent';
import {environment} from '../../utils/constant';

const COLORS = {
  bg: '#F5F3EF',
  text: '#1B1B1B',
  sub: '#4B5563',
  accent: '#D48A4A',
};

/**
 * Params: { document: 'privacy' | 'terms' }
 */
export default function LegalDocumentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const key = route.params?.document === 'terms' ? 'terms' : 'privacy';
  const doc = LEGAL_DOCUMENTS[key];

  const externalUrl = useMemo(() => {
    if (key === 'privacy' && environment.Privacy_policy) {
      return environment.Privacy_policy;
    }
    if (key === 'terms' && environment.Terms_of_service) {
      return environment.Terms_of_service;
    }
    return null;
  }, [key]);

  return (
    <SafeAreaView style={styles.wrapper} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={12}>
          <Icon name="arrow-back" size={26} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {doc.title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator>
        <Text style={styles.meta}>
          {LEGAL_META.appName} · Last updated: {doc.lastUpdated}
        </Text>

        {doc.intro.map((p, i) => (
          <Text key={`intro-${i}`} style={styles.paragraph}>
            {p}
          </Text>
        ))}

        {doc.sections.map(section => (
          <View key={section.heading} style={styles.section}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            {section.paragraphs.map((p, j) => (
              <Text key={`${section.heading}-${j}`} style={styles.paragraph}>
                {p}
              </Text>
            ))}
          </View>
        ))}

        {externalUrl ? (
          <Pressable
            onPress={() => Linking.openURL(externalUrl)}
            style={styles.linkBlock}>
            <Text style={styles.linkText}>Open this document in browser</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  headerSpacer: {
    width: 42,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  meta: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '600',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.sub,
    marginBottom: 10,
    textAlign: 'left',
  },
  linkBlock: {
    marginTop: 8,
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
    textDecorationLine: 'underline',
  },
});
