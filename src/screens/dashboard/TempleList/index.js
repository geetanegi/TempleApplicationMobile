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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Star, ChevronRight, Menu, Bell, MessageCircle } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { colors } from '../../../global/theme';
import SearchInput from '../Main/SearchInput';
import HeaderDashboard from '../../../components/dashboardHeader';
import { DUMMY_TEMPLES } from './dummyTemples';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING_H = 20;
const CARD_WIDTH = SCREEN_WIDTH - CARD_PADDING_H * 2;
const RIGHT_BUTTON_WIDTH = CARD_WIDTH * 0.1;

const TAB_OPTIONS = [
  { key: 'mandir', label: 'Mandir' },
  { key: 'dharmshala', label: 'Dharmshala' },
];

const DEFAULT_REGION = {
  latitude: 21.0,
  longitude: 78.0,
  latitudeDelta: 8,
  longitudeDelta: 8,
};

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

const TempleLocator = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('mandir');
  const [initialRegion, setInitialRegion] = useState(DEFAULT_REGION);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const fine = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access',
          message: 'Temple Locator needs your location to show nearby places and your position on the map.',
          buttonPositive: 'OK',
        }
      );
      if (fine !== PermissionsAndroid.RESULTS.GRANTED) return false;
      const coarse = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'Location Access',
          message: 'Temple Locator needs your location to show your position on the map.',
          buttonPositive: 'OK',
        }
      );
      return coarse === PermissionsAndroid.RESULTS.GRANTED || fine === PermissionsAndroid.RESULTS.GRANTED;
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
          const isTimeout = err?.code === 3;
          const message = isTimeout
            ? 'Location request timed out. Please ensure Location is on and try again.'
            : (err?.message || 'Could not get location');
          setLocationError(message);
        },
        geoOptions
      );
    });
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCurrentLocation();
    }, []),
  );

  const filteredTemples = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return [];
    return DUMMY_TEMPLES.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
    );
  }, [searchText]);

  const mapMarkers = useMemo(() => {
    if (activeTab === 'mandir') {
      return DUMMY_TEMPLES.filter(t => t.type === 'mandir');
    }
    if (activeTab === 'dharmshala') {
      return DUMMY_TEMPLES.filter(t => t.type === 'dharmshala');
    }
    return [];
  }, [activeTab]);

  const showSearchResults = searchText.trim().length > 0;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <HeaderDashboard
        title="Temple Locator"
        LeftIcon={Menu}
        RightIcon1={Bell}
        RightIcon2={MessageCircle}
        leftNav="HomeDrawer"
        rightNav1="Notifications"
        rightNav2="Chat"
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
              <Pressable style={styles.retryButton} onPress={fetchCurrentLocation}>
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
          >
            {mapMarkers.map(place => (
              <Marker
                key={place.id}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                title={place.name}
                description={place.location}
              />
            ))}
          </MapView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TempleLocator;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
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
