import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
  StatusBar,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Linking,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Star, ChevronRight, Menu, Bell, MessageCircle } from 'lucide-react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { colors } from '../../../global/theme';
import SearchInput from '../Main/SearchInput';
import HeaderDashboard from '../../../components/dashboardHeader';
import { useNotificationBellCount } from '../../../hooks/useNotificationBellCount';
import { getTempleList } from '../../../utils/apicalls/templeHandler';
import { DUMMY_TEMPLES } from './dummyTemples';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING_H = 20;
const CARD_WIDTH = SCREEN_WIDTH - CARD_PADDING_H * 2;
const RIGHT_BUTTON_WIDTH = CARD_WIDTH * 0.1;

const TAB_OPTIONS = [
  { key: 'mandir', label: 'Mandir' },
];

const DEFAULT_REGION = {
  latitude: 21.0,
  longitude: 78.0,
  latitudeDelta: 8,
  longitudeDelta: 8,
};
// Show markers only after zooming in beyond country-level view.
// India/all-states view is usually much wider than this.
const MARKER_VISIBLE_MAX_LAT_DELTA = 2.5;
const MARKER_VISIBLE_MAX_LNG_DELTA = 2.5;

const TempleCard = ({ item, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={() => onPress?.(item)}>
      <View style={styles.leftSection}>
        <Image
          source={{ uri: item.image }}
          style={styles.templeImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.centerSection}>
        <Text style={styles.templeName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.location}>{item.location}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Star size={14} color="#EAB308" fill="#EAB308" />
          <Star size={14} color="#EAB308" fill="#EAB308" />
          <Star size={14} color="#EAB308" fill="#EAB308" />
          <Star size={14} color="#EAB308" fill="#EAB308" />
          <Star size={14} color="#EAB308" fill="#EAB308" />
          <Text style={styles.distance}>  {item.distance}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => onPress?.(item)}
          android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
        >
          <ChevronRight size={22} color={colors.DARK_BLACK} strokeWidth={2.5} />
        </Pressable>
      </View>
    </Pressable>
  );
};

const IMG_FALLBACK = [
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=200&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=200&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&auto=format&fit=crop&q=60',
];

const toTempleItem = (t, index) => ({
  id: String(t.id ?? index),
  name: t.name || 'Temple',
  location: t.location || t.address || '—',
  rating: 4.5,
  distance: '— km away',
  image: t.profileImage?.url ?? t.image ?? IMG_FALLBACK[index % IMG_FALLBACK.length],
  type: t.type || 'mandir',
  latitude: t.latitude,
  longitude: t.longitude,
  views: t.views ?? 0,
});

const TempleLocator = () => {
  const navigation = useNavigation();
  const { count: notificationBellCount } = useNotificationBellCount();
  const route = useRoute();
  const mapRef = useRef(null);
  const focusTemple = route.params?.focusTemple;
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('mandir');
  const [initialRegion, setInitialRegion] = useState(() => {
    if (focusTemple?.latitude != null && focusTemple?.longitude != null) {
      return {
        latitude: focusTemple.latitude,
        longitude: focusTemple.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
    }
    return DEFAULT_REGION;
  });
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [currentLatitudeDelta, setCurrentLatitudeDelta] = useState(
    initialRegion?.latitudeDelta ?? DEFAULT_REGION.latitudeDelta
  );
  const [currentLongitudeDelta, setCurrentLongitudeDelta] = useState(
    initialRegion?.longitudeDelta ?? DEFAULT_REGION.longitudeDelta
  );
  /** All temples from API (search includes rows without coordinates). */
  const [allTempleItems, setAllTempleItems] = useState([]);
  const [templesLoading, setTemplesLoading] = useState(true);
  const pendingRetryAfterSettingsRef = useRef(false);
  /** Last Geolocation error code (1=denied, 2=unavailable, 3=timeout) — Android messages often omit "unavailable" as a substring. */
  const lastGeolocationErrorCodeRef = useRef(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      return new Promise(resolve => {
        Geolocation.requestAuthorization(
          () => resolve(true),
          () => resolve(false)
        );
      });
    }
    if (Platform.OS !== 'android') return true;
    try {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      const fine = results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
      const coarse = results[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION];
      return (
        fine === PermissionsAndroid.RESULTS.GRANTED ||
        coarse === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (e) {
      return false;
    }
  };

  const fetchCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError(null);
    requestLocationPermission().then(granted => {
      if (!granted) {
        setLocationLoading(false);
        setLocationError('Location permission denied');
        return;
      }
      const geoOptions = {
        enableHighAccuracy: false,
        timeout: 35000,
        maximumAge: 60000,
      };
      Geolocation.getCurrentPosition(
        position => {
          lastGeolocationErrorCodeRef.current = null;
          const { latitude, longitude } = position.coords;
          const userRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };
          setInitialRegion(userRegion);
          setLocationLoading(false);
          if (mapRef.current) {
            mapRef.current.animateToRegion(userRegion, 500);
          }
        },
        err => {
          setLocationLoading(false);
          const code = err?.code;
          lastGeolocationErrorCodeRef.current = code ?? null;
          const isTimeout = code === 3;
          const message = isTimeout
            ? 'Location request timed out. Please ensure Location is on and try again.'
            : (err?.message || 'Could not get location');
          setLocationError(message);
        },
        geoOptions
      );
    });
  };

  /** Re-prompt permission / OS location UI, then retry fix (used when map shows Retry). */
  const handleRetryLocation = async () => {
    const prevErr = locationError;
    const lastCode = lastGeolocationErrorCodeRef.current;
    setLocationLoading(true);
    setLocationError(null);

    const granted = await requestLocationPermission();
    if (!granted) {
      setLocationLoading(false);
      setLocationError('Location permission denied');
      try {
        await Linking.openSettings();
        pendingRetryAfterSettingsRef.current = true;
      } catch (e) {
        /* ignore */
      }
      return;
    }

    // Android: code 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT (GPS off / location off / no fix).
    // Messages like "Location not available" do not contain the substring "unavailable".
    const looksLikeLocationServicesIssue =
      lastCode === 2 ||
      lastCode === 3 ||
      (prevErr &&
        /(location is on|timed out|not available|no location provider|fusedlocation|settings\)|temporarily unavailable)/i.test(
          prevErr
        ));

    // App permission denied at native layer while JS permission looked OK
    const looksLikeAppPermissionIssue = lastCode === 1;

    if (Platform.OS === 'android' && looksLikeAppPermissionIssue) {
      try {
        await Linking.openSettings();
        pendingRetryAfterSettingsRef.current = true;
      } catch (e) {
        /* ignore */
      }
      setLocationLoading(false);
      return;
    }

    if (looksLikeLocationServicesIssue) {
      try {
        if (Platform.OS === 'android') {
          try {
            await Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
          } catch (e) {
            await Linking.openSettings();
          }
        } else {
          await Linking.openSettings();
        }
        pendingRetryAfterSettingsRef.current = true;
      } catch (e) {
        /* ignore */
      }
      setLocationLoading(false);
      return;
    }

    fetchCurrentLocation();
  };

  useEffect(() => {
    const sub = AppState.addEventListener('change', next => {
      if (next !== 'active' || !pendingRetryAfterSettingsRef.current) return;
      pendingRetryAfterSettingsRef.current = false;
      fetchCurrentLocation();
    });
    return () => sub.remove();
  }, []);

  const loadTemples = useCallback(async () => {
    setTemplesLoading(true);
    try {
      const list = await getTempleList();
      const arr = Array.isArray(list) ? list : [];
      setAllTempleItems(arr.map(toTempleItem));
    } catch {
      setAllTempleItems([]);
    } finally {
      setTemplesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (focusTemple?.latitude != null && focusTemple?.longitude != null) {
      setLocationLoading(false);
      setLocationError(null);
      const region = {
        latitude: focusTemple.latitude,
        longitude: focusTemple.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      setInitialRegion(region);
      setTimeout(() => {
        mapRef.current?.animateToRegion(region, 500);
      }, 300);
    } else {
      fetchCurrentLocation();
    }
  }, [focusTemple?.latitude, focusTemple?.longitude]);

  const lastLoadRef = useRef(0);
  const hasMountedRef = useRef(false);
  const FOCUS_REFRESH_THROTTLE_MS = 30000;

  useEffect(() => {
    loadTemples().then(() => { lastLoadRef.current = Date.now(); });
  }, [loadTemples]);

  useFocusEffect(
    useCallback(() => {
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        return;
      }
      if (Date.now() - lastLoadRef.current < FOCUS_REFRESH_THROTTLE_MS) return;
      fetchCurrentLocation();
      loadTemples().then(() => { lastLoadRef.current = Date.now(); });
    }, [loadTemples]),
  );

  /** Map pins only where lat/lng exist; fallback dummy data if API empty. */
  const templesForMap = useMemo(() => {
    const withCoords = allTempleItems.filter(
      t => t.latitude != null && t.longitude != null,
    );
    return withCoords.length > 0 ? withCoords : DUMMY_TEMPLES;
  }, [allTempleItems]);

  /** Search uses every temple from the API (including no coordinates — matches DB bulk imports). */
  const searchDataset =
    allTempleItems.length > 0 ? allTempleItems : DUMMY_TEMPLES;

  const filteredTemples = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return [];
    return searchDataset.filter(
      t =>
        (t.name || '').toLowerCase().includes(q) ||
        (t.location || '').toLowerCase().includes(q),
    );
  }, [searchText, searchDataset]);

  const mapMarkers = useMemo(() => {
    if (activeTab === 'mandir') {
      return templesForMap.filter(t => t.type === 'mandir' || !t.type);
    }
    if (activeTab === 'dharmshala') {
      return templesForMap.filter(t => t.type === 'dharmshala');
    }
    return [];
  }, [activeTab, templesForMap]);
  const shouldShowTempleMarkers =
    currentLatitudeDelta <= MARKER_VISIBLE_MAX_LAT_DELTA &&
    currentLongitudeDelta <= MARKER_VISIBLE_MAX_LNG_DELTA;

  const showSearchResults = searchText.trim().length > 0;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.content}>
      <HeaderDashboard
        title="Temple Locator"
        LeftIcon={Menu}
        RightIcon1={Bell}
        RightIcon2={MessageCircle}
        leftNav="HomeDrawer"
        rightNav1="Notifications"
        rightNav2="Chat"
        rightIcon1BadgeCount={notificationBellCount}
      />
      <View style={styles.searchWrap}>
        <SearchInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search temples"
        />
      </View>

      {/* Tabs: Mandir, Dharmshala */}
      <View style={styles.tabsRow}>
        {TAB_OPTIONS.map(tab => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.key && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Search results list - only when user is searching */}
      {showSearchResults && (
        <View style={styles.listContainer}>
          <FlatList
            data={filteredTemples}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
            <TempleCard
              item={item}
              onPress={temple => navigation.navigate('TempleDetails', { temple })}
            />
          )}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {/* Map - below tabs when not showing search results */}
      {!showSearchResults && (
        <View style={styles.mapContainer}>
          {locationLoading && (
            <View style={styles.mapOverlay}>
              <ActivityIndicator size="large" color={colors.PRIMARY_BUTTON} />
              <Text style={styles.mapOverlayText}>Getting your location...</Text>
            </View>
          )}
          {locationError && !locationLoading && (
            <View style={styles.mapOverlay}>
              <Text style={styles.mapOverlayError}>{locationError}</Text>
              <Pressable style={styles.retryButton} onPress={handleRetryLocation}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          )}
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation
            showsMyLocationButton
            loadingEnabled
            followsUserLocation={false}
            onRegionChangeComplete={(region) => {
              if (region?.latitudeDelta != null) {
                setCurrentLatitudeDelta(region.latitudeDelta);
              }
              if (region?.longitudeDelta != null) {
                setCurrentLongitudeDelta(region.longitudeDelta);
              }
            }}
          >
            {shouldShowTempleMarkers && mapMarkers.map(place => (
              <Marker
                key={place.id}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                title={place.name}
                description={place.location}
                onPress={() => navigation.navigate('TempleDetails', { temple: place })}
              >
                <Callout
                  tooltip={false}
                  onPress={() => navigation.navigate('TempleDetails', { temple: place })}
                >
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle} numberOfLines={1}>
                      {place.name}
                    </Text>
                    {place.location ? (
                      <Text style={styles.calloutSub} numberOfLines={1}>
                        {place.location}
                      </Text>
                    ) : null}
                    <Text style={styles.calloutAction}>Tap to view details</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </View>
      )}
      </View>
    </SafeAreaView>
  );
};

export default TempleLocator;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.BACKGROUD_ICON_COLOR,
  },
  tabActive: {
    backgroundColor: colors.PRIMARY_BUTTON,
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.DARK_BLACK,
  },
  tabLabelActive: {
    color: colors.DARK_BLACK,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: CARD_PADDING_H,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 14,
    minHeight: 96,
    borderWidth: 1,
    borderColor: colors.BORDER_GREY_COLOR,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    justifyContent: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
  },
  templeImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.grey,
    backgroundColor: colors.BACKGROUD_ICON_COLOR,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  templeName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.DARK_BLACK,
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: colors.PRIMARY_LIGHT_TEXT,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.DARK_BLACK,
    marginRight: 4,
  },
  distance: {
    fontSize: 12,
    color: colors.PRIMARY_LIGHT_TEXT,
    marginLeft: 4,
  },
  rightSection: {
    width: RIGHT_BUTTON_WIDTH,
    minWidth: 36,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.PRIMARY_BUTTON,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    minHeight: 280,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  mapOverlayText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.DARK_BLACK,
  },
  mapOverlayError: {
    fontSize: 14,
    color: colors.DARK_BLACK,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  callout: {
    minWidth: 160,
    maxWidth: 220,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.DARK_BLACK,
    marginBottom: 2,
  },
  calloutSub: {
    fontSize: 13,
    color: colors.PRIMARY_LIGHT_TEXT,
    marginBottom: 6,
  },
  calloutAction: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.PRIMARY_BUTTON,
  },
  retryButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.PRIMARY_BUTTON,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.DARK_BLACK,
  },
});
