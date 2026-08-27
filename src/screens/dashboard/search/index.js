import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Keyboard,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, X, TrendingUp, MapPin, Flame, Bell, MessageCircle, History, User } from 'lucide-react-native';
import Icon from 'react-native-vector-icons/Feather';
import st from '../../../global/styles';
import { colors, APP_TEXT } from '../../../global/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderDashboard from '../../../components/dashboardHeader';
import { useNotificationBellCount } from '../../../hooks/useNotificationBellCount';
import { searchUsers, getProfilePictureUrlByUserId, resolveProfilePictureUrl } from '../../../utils/apicalls/profileHandler';
import { getPopularTemples, getTrendingTemples } from '../../../utils/apicalls/templeHandler';
import { openUserProfile, safeGoBack } from '../../../utils/navigation/openUserProfile';

const RECENT_SEARCHES_KEY = '@search_recent';

/** Same back glyph as `components/back` (used across Auth / stack headers). */
const BackLeftIcon = ({ color }) => (
  <Icon name="chevron-left" size={25} color={color} />
);

const CATEGORIES = [
  { id: 'recent', label: 'Recent', Icon: History },
  { id: 'nearby', label: 'Near By', Icon: MapPin },
  { id: 'trending', label: 'Trending', Icon: TrendingUp },
  { id: 'popular', label: 'Popular', Icon: Flame },
];

const DEBOUNCE_MS = 400;

function SearchUserAvatar({ user }) {
  const [failed, setFailed] = useState(false);
  const hasPhoto = Boolean(user?.imageUrl);
  const uri = hasPhoto
    ? (getProfilePictureUrlByUserId(user.id) || resolveProfilePictureUrl(user.imageUrl))
    : null;
  const showPhoto = Boolean(uri) && !failed;

  useEffect(() => {
    setFailed(false);
  }, [user?.id, uri]);

  if (!showPhoto) {
    return (
      <View style={[styles.userAvatar, styles.userAvatarPlaceholder]}>
        <User size={22} color={colors.grey || '#9ca3af'} strokeWidth={2} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={styles.userAvatar}
      onError={() => setFailed(true)}
    />
  );
}

const TEMPLE_IMG_FALLBACK = 'https://images.unsplash.com/photo-1548013146-72479768bada?w=200&auto=format&fit=crop&q=60';

const toTempleItem = (t, index) => ({
  id: String(t.id ?? index),
  name: t.name || 'Temple',
  location: t.location || t.address || '—',
  image: t.profileImage?.url ?? t.image ?? TEMPLE_IMG_FALLBACK,
  views: t.views ?? 0,
  latitude: t.latitude,
  longitude: t.longitude,
  type: t.type || 'mandir',
});

const SearchScreen = () => {
  const navigation = useNavigation();
  const { count: notificationBellCount } = useNotificationBellCount();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [popularTemples, setPopularTemples] = useState([]);
  const [trendingTemples, setTrendingTemples] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('recent');
  const debounceRef = useRef(null);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadPopularAndTrending = useCallback(async () => {
    setSectionLoading(true);
    try {
      const [popular, trending] = await Promise.all([
        getPopularTemples(),
        getTrendingTemples(),
      ]);
      setPopularTemples((Array.isArray(popular) ? popular : []).map(toTempleItem));
      setTrendingTemples((Array.isArray(trending) ? trending : []).map(toTempleItem));
    } catch {
      setPopularTemples([]);
      setTrendingTemples([]);
    } finally {
      setSectionLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPopularAndTrending();
  }, [loadPopularAndTrending]);

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

  const removeRecentSearch = async (text) => {
    const next = recentSearches.filter((s) => s !== text);
    setRecentSearches(next);
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  const runUserSearch = useCallback(async (q) => {
    const trimmed = (q || '').trim();
    if (!trimmed) {
      setUserResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const list = await searchUsers(trimmed, 0, 30);
      setUserResults(list);
    } catch (e) {
      setUserResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = (query || '').trim();
    if (!trimmed) {
      setUserResults([]);
      setSearchLoading(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      runUserSearch(query);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runUserSearch]);

  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    if (query.trim()) addRecentSearch(query.trim());
  };

  const handleRecentPress = (item) => {
    setQuery(item);
  };

  const displayName = (user) => {
    const first = user.firstName || '';
    const last = user.lastName || '';
    const name = [first, last].filter(Boolean).join(' ').trim();
    return name || user.username || 'User';
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <HeaderDashboard
        title="JainSansaar"
        LeftIcon={BackLeftIcon}
        RightIcon1={Bell}
        RightIcon2={MessageCircle}
        onLeftPress={() => safeGoBack(navigation)}
        rightNav1="Notifications"
        rightNav2="Chat"
        rightIcon1BadgeCount={notificationBellCount}
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
          {(query || '').trim().length > 0 ? (
            <>
              {searchLoading ? (
                <View style={styles.loadingWrap}>
                  <ActivityIndicator size="large" color={colors.PRIMARY_BUTTON} />
                  <Text style={styles.loadingText}>Searching users...</Text>
                </View>
              ) : userResults.length > 0 ? (
                <>
                  <Text style={styles.subheading}>Users</Text>
                  <View style={styles.userList}>
                    {userResults.map((user) => (
                      <Pressable
                        key={user.id}
                        style={styles.userRow}
                        onPress={() => {
                          addRecentSearch(query.trim());
                          openUserProfile(navigation, user.id);
                        }}
                      >
                        <SearchUserAvatar user={user} />
                        <View style={styles.userInfo}>
                          <Text style={styles.userName}>{displayName(user)}</Text>
                          {user.username ? (
                            <Text style={styles.userUsername}>@{user.username}</Text>
                          ) : null}
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </>
              ) : (
                <Text style={styles.emptyText}>No users found</Text>
              )}
            </>
          ) : (
            <>
              <View style={styles.categoriesRow}>
                {CATEGORIES.map(({ id, label, Icon }) => (
                  <Pressable
                    key={id}
                    style={[styles.categoryItem, selectedCategory === id && styles.categoryItemActive]}
                    onPress={() => {
                      if (id === 'nearby') {
                        navigation.navigate('Temples', { screen: 'TempleList', params: { focusTemple: null } });
                      } else {
                        setSelectedCategory(id);
                      }
                    }}
                  >
                    <View style={[styles.categoryIconWrap, selectedCategory === id && styles.categoryIconWrapActive]}>
                      <Icon size={24} color={colors.DARK_BLACK} strokeWidth={2} />
                    </View>
                    <Text style={[styles.categoryLabel, selectedCategory === id && styles.categoryLabelActive]}>{label}</Text>
                  </Pressable>
                ))}
              </View>

              {selectedCategory === 'recent' && (
                <>
                  <Text style={styles.subheading}>Recent Search</Text>
                  <View style={styles.recentList}>
                    {(recentSearches.length ? recentSearches : []).slice(0, 10).map((item, index) => (
                      <Pressable
                        key={`${item}-${index}`}
                        style={styles.recentItem}
                        onPress={() => handleRecentPress(item)}
                      >
                        <Text style={styles.recentText} numberOfLines={1}>{item}</Text>
                        <Pressable
                          onPress={() => removeRecentSearch(item)}
                          hitSlop={10}
                          style={styles.recentRemoveBtn}
                        >
                          <X size={16} color={colors.grey || '#9ca3af'} />
                        </Pressable>
                      </Pressable>
                    ))}
                    {recentSearches.length === 0 && (
                      <Text style={styles.emptyText}>No recent searches</Text>
                    )}
                  </View>
                </>
              )}

              {selectedCategory === 'trending' && (
                <>
                  <Text style={styles.subheading}>Trending Temples</Text>
                  {sectionLoading ? (
                    <View style={styles.loadingWrap}>
                      <ActivityIndicator size="small" color={colors.PRIMARY_BUTTON} />
                    </View>
                  ) : trendingTemples.length > 0 ? (
                    <View style={styles.recentList}>
                      {trendingTemples.map((temple) => (
                        <Pressable
                          key={temple.id}
                          style={styles.recentItem}
                          onPress={() => navigation.navigate('Temples', { screen: 'TempleDetails', params: { temple } })}
                        >
                          <Text style={styles.recentText}>{temple.name}</Text>
                          {temple.location ? (
                            <Text style={styles.recentSubtext}>{temple.location}</Text>
                          ) : null}
                        </Pressable>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.emptyText}>No trending temples</Text>
                  )}
                </>
              )}

              {selectedCategory === 'popular' && (
                <>
                  <Text style={styles.subheading}>Popular Temples</Text>
                  {sectionLoading ? (
                    <View style={styles.loadingWrap}>
                      <ActivityIndicator size="small" color={colors.PRIMARY_BUTTON} />
                    </View>
                  ) : popularTemples.length > 0 ? (
                    <View style={styles.recentList}>
                      {popularTemples.map((temple) => (
                        <Pressable
                          key={temple.id}
                          style={styles.recentItem}
                          onPress={() => navigation.navigate('Temples', { screen: 'TempleDetails', params: { temple } })}
                        >
                          <Text style={styles.recentText}>{temple.name}</Text>
                          {temple.location ? (
                            <Text style={styles.recentSubtext}>{temple.location}</Text>
                          ) : null}
                        </Pressable>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.emptyText}>No popular temples</Text>
                  )}
                </>
              )}
            </>
          )}
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
  categoryItemActive: {
    opacity: 1,
  },
  categoryIconWrapActive: {
    backgroundColor: colors.PRIMARY_BUTTON || colors.orange || '#D48A4A',
  },
  categoryLabelActive: {
    color: colors.PRIMARY_BUTTON || colors.orange || '#D48A4A',
    fontWeight: '600',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  recentText: {
    fontSize: 15,
    color: colors.DARK_BLACK,
    fontWeight: '500',
    flex: 1,
  },
  recentRemoveBtn: {
    padding: 6,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentSubtext: {
    fontSize: 13,
    color: colors.grey,
    marginTop: 2,
  },
  loadingWrap: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.grey,
  },
  userList: {
    gap: 4,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.BACKGROUD_ICON_COLOR || '#e5e7eb',
  },
  userAvatarPlaceholder: {
    backgroundColor: colors.BACKGROUD_ICON_COLOR || '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.DARK_BLACK,
  },
  userUsername: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 15,
    color: colors.grey,
    paddingVertical: 24,
  },
});
