import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, X, TrendingUp, MapPin, Flame, Zap, Menu, Bell, MessageCircle } from 'lucide-react-native';
import st from '../../../global/styles';
import { colors, APP_TEXT } from '../../../global/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderDashboard from '../../../components/dashboardHeader';

const RECENT_SEARCHES_KEY = '@search_recent';

const CATEGORIES = [
  { id: 'trending', label: 'Trending', Icon: TrendingUp },
  { id: 'nearby', label: 'Near By', Icon: MapPin },
  { id: 'popular', label: 'Popular', Icon: Flame },
  { id: 'hot', label: 'Hot', Icon: Zap },
];

const SearchScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentSearches(Array.isArray(parsed) ? parsed.slice(0, 10) : []);
      }
    } catch (e) {
      // ignore
    }
  };

  const addRecentSearch = async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    const next = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 10);
    setRecentSearches(next);
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    if (query.trim()) {
      addRecentSearch(query.trim());
      // Optional: navigate to results or stay and show results
    }
  };

  const handleRecentPress = (item) => {
    setQuery(item);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <HeaderDashboard
        title="JainSansaar"
        LeftIcon={Menu}
        RightIcon1={Bell}
        RightIcon2={MessageCircle}
        leftNav="HomeDrawer"
        rightNav1="Notifications"
        rightNav2="Chat"
      />

      <View style={styles.content}>
        <View style={[st.pd_H20, styles.searchBarRow]}>
          <View style={styles.searchWrapper}>
            <Search size={18} color={colors.DARK_BLACK} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={APP_TEXT.SEARCH}
              placeholderTextColor="#9ca3af"
              style={styles.input}
              returnKeyType="search"
              onSubmitEditing={handleSearchSubmit}
              autoFocus
            />
            {(query || '').trim().length > 0 && (
              <Pressable
                onPress={() => setQuery('')}
                hitSlop={10}
                style={styles.clearBtn}
              >
                <X size={18} color={colors.DARK_BLACK} />
              </Pressable>
            )}
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.categoriesRow}>
          {CATEGORIES.map(({ id, label, Icon }) => (
            <Pressable
              key={id}
              style={styles.categoryItem}
              onPress={() => {}}
            >
              <View style={styles.categoryIconWrap}>
                <Icon size={24} color={colors.DARK_BLACK} strokeWidth={2} />
              </View>
              <Text style={styles.categoryLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.subheading}>Recent Search</Text>
        <View style={styles.recentList}>
          {(recentSearches.length ? recentSearches : ['Temple events', 'Aarti timings', 'Nearby temples']).slice(0, 3).map((item, index) => (
            <Pressable
              key={`${item}-${index}`}
              style={styles.recentItem}
              onPress={() => handleRecentPress(item)}
            >
              <Text style={styles.recentText}>{item}</Text>
            </Pressable>
          ))}
        </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  searchBarRow: {
    marginBottom: 10,
  },
  searchWrapper: {
    height: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#1f2937',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#111827',
    paddingRight: 8,
  },
  clearBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  categoryItem: {
    alignItems: 'center',
    flex: 1,
  },
  categoryIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.BACKGROUD_ICON_COLOR || '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 13,
    color: colors.DARK_BLACK,
    fontWeight: '500',
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.DARK_BLACK,
    marginBottom: 12,
  },
  recentList: {
    gap: 4,
  },
  recentItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  recentText: {
    fontSize: 15,
    color: colors.grey,
  },
});
