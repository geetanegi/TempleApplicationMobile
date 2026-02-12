import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { colors } from '../../../global/theme';
import { getUserId } from '../../../redux/store/getState';
import { locateTemple } from '../../../utils/apicalls/templeHandler';
import { triggerTempleBarRefresh } from '../../../utils/templeBarRefresh';
import Toast from 'react-native-simple-toast';

const DEFAULT_REGION = {
  latitude: 23.5,
  longitude: 78.0,
  latitudeDelta: 8,
  longitudeDelta: 8,
};

const LocateTempleScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = getUserId();

  const [marker, setMarker] = useState(null);
  const [templeName, setTempleName] = useState(route.params?.templeName || '');
  const [locationText, setLocationText] = useState(route.params?.location || '');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const fine = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access',
          message: 'Need your location to find nearby temples and set your temple location.',
          buttonPositive: 'OK',
        }
      );
      return fine === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  const goToCurrentLocation = useCallback(() => {
    requestLocationPermission().then(granted => {
      if (!granted) {
        Toast.show('Location permission denied');
        return;
      }
      Geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setMarker({ latitude, longitude });
        },
        () => Toast.show('Could not get location'),
        { enableHighAccuracy: false, timeout: 15000 }
      );
    });
  }, []);

  React.useEffect(() => {
    requestLocationPermission().then(granted => {
      setLoading(false);
      if (granted) {
        Geolocation.getCurrentPosition(
          pos => {
            const { latitude, longitude } = pos.coords;
            setMarker({ latitude, longitude });
          },
          () => {},
          { enableHighAccuracy: false, timeout: 10000 }
        );
      }
    });
  }, []);

  const onMapPress = e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  };

  const onMarkerDragEnd = e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  };

  const handleSave = async () => {
    if (!userId) {
      Toast.show('Please log in to save');
      return;
    }
    if (!marker) {
      Toast.show('Select a location on the map first (tap or long-press)');
      return;
    }
    setSaving(true);
    try {
      await locateTemple(userId, {
        latitude: marker.latitude,
        longitude: marker.longitude,
        templeName: templeName.trim() || undefined,
        location: locationText.trim() || undefined,
      });
      Toast.show('Temple location saved');
      triggerTempleBarRefresh();
      navigation.goBack();
    } catch (err) {
      const msg = err?.message || err?.response?.data?.message || 'Failed to save';
      Toast.show(msg);
    } finally {
      setSaving(false);
    }
  };

  const region = marker
    ? { ...marker, latitudeDelta: 0.02, longitudeDelta: 0.02 }
    : DEFAULT_REGION;

  return (
    <View style={styles.screen}>
      <MapView
        style={styles.map}
        initialRegion={region}
        region={marker ? undefined : region}
        onPress={onMapPress}
        showsUserLocation
        showsMyLocationButton
        loadingEnabled
      >
        {marker && (
          <Marker
            coordinate={marker}
            draggable
            onDragEnd={onMarkerDragEnd}
            title="Temple location"
          />
        )}
      </MapView>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={colors.PRIMARY_BUTTON} />
        </View>
      )}

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Temple name (optional)"
          placeholderTextColor="#999"
          value={templeName}
          onChangeText={setTempleName}
        />
        <TextInput
          style={styles.input}
          placeholder="Location / Address (optional)"
          placeholderTextColor="#999"
          value={locationText}
          onChangeText={setLocationText}
        />
        <View style={styles.row}>
          <Pressable style={styles.gpsBtn} onPress={goToCurrentLocation}>
            <Text style={styles.gpsBtnText}>Use my location</Text>
          </Pressable>
          <Pressable
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Save location</Text>
            )}
          </Pressable>
        </View>
        <Text style={styles.hint}>
          Tap on the map to set your temple location, then save.
        </Text>
      </View>
    </View>
  );
};

export default LocateTempleScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1, width: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.BORDER_GREY_COLOR,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 10,
    color: colors.DARK_BLACK,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  gpsBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: colors.BACKGROUD_ICON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.DARK_BLACK,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: colors.PRIMARY_BUTTON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.DARK_BLACK,
  },
  hint: {
    fontSize: 12,
    color: colors.PRIMARY_LIGHT_TEXT,
    marginTop: 10,
  },
});
