import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useCallback } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';

import SearchInput from '../Main/SearchInput';
import { APP_TEXT, colors } from '../../../global/theme';
import { musicList } from '../../../dummy';
import MusicCard from '../../../components/musicCard';

const { width } = Dimensions.get('window');

const SubCategoryPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { title = 'Granth', image } = route.params || {};
  const [searchText, setSearchText] = useState('');

  const filteredList = React.useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return musicList;
    return musicList.filter(
      (item) =>
        (item.title || '').toLowerCase().includes(q) ||
        (item.artist || '').toLowerCase().includes(q)
    );
  }, [searchText]);

  const renderItem = useCallback(
    ({ item }) => <MusicCard item={item} />,
    []
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>No granths found</Text>
        <Text style={styles.emptyHint}>Try a different search term</Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Back button overlay */}
      <Pressable
        style={[styles.backBtn, { top: insets.top + 8 }]}
        onPress={() => navigation.goBack()}
        hitSlop={12}
      >
        <ChevronLeft size={28} color="#fff" strokeWidth={2.5} />
      </Pressable>

      <View style={styles.headerSection}>
        {/* Hero header with gradient */}
        <View style={styles.heroWrap}>
          {image ? (
            <Image source={image} style={styles.heroImage} resizeMode="cover" />
          ) : null}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{title}</Text>
            <Text style={styles.heroSubtitle}>
              Sacred texts and devotional literature
            </Text>
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchSection}>
          <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={APP_TEXT.SEARCH}
          />
        </View>
      </View>

      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

export default SubCategoryPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F3',
  },

  backBtn: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D48A4A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  headerSection: {
    marginBottom: 8,
  },

  heroWrap: {
    width,
    height: 180,
    backgroundColor: '#D48A4A',
    position: 'relative',
    overflow: 'hidden',
  },

  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },

  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },

  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },

  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  emptyWrap: {
    paddingVertical: 48,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#6b7280',
  },

  emptyHint: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 6,
  },
});
