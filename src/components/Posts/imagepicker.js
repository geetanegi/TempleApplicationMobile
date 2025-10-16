import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Text,
  ActivityIndicator,
  StyleSheet,
  AppState,
} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Camera} from 'lucide-react-native';
import {Play} from 'lucide-react-native';
// import {ProcessingManager} from 'react-native-video-processing';

const InstaGallery = () => {
  const [photos, setPhotos] = useState(['camera']); // first cell = camera
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleVideoCrop = async videoUri => {
    // try {
    //   const result = await ProcessingManager.trim(videoUri, {
    //     startTime: 0, // seconds
    //     endTime: 10, // seconds
    //     quality: 'high', // 'low' | 'medium' | 'high'
    //     saveToCameraRoll: true,
    //   });
    //   console.log('Trimmed video path:', result);
    //   setSelectedPhoto(result); // show trimmed video
    // } catch (err) {
    //   console.log('Video trim failed:', err);
    // }
    console.log(videoUri);
  };

  // 📍 Request permission to access photos
  const requestPhotoPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          const results = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ]);

          return (
            results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED
          );
        } else {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to your photos',
              buttonPositive: 'OK',
            },
          );
          return result === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  // 📷 Open camera directly
  const openCamera = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        width: 1080,
        height: 1080,
        cropping: true,
        mediaType: 'any',
      });

      setSelectedPhoto(image.path);
    } catch (err) {
      console.log('Camera error:', err);
    }
  };

  // 🖼️ Fetch photos from device gallery
  const fetchPhotos = async () => {
    try {
      const photosResult = await CameraRoll.getPhotos({
        first: 100,
        assetType: 'Photos',
      });
      const videosResult = await CameraRoll.getPhotos({
        first: 100,
        assetType: 'Videos',
      });

      const uris = [
        ...photosResult.edges.map(edge => edge.node.image.uri),
        ...videosResult.edges.map(edge => edge.node.image.uri),
      ];

      setPhotos(['camera', ...uris]);
    } catch (error) {
      console.log('Error loading photos/videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let appStateListener;
    (async () => {
      const granted = await requestPhotoPermission();
      if (granted) {
        fetchPhotos();

        appStateListener = AppState.addEventListener('change', state => {
          if (state === 'active') {
            fetchPhotos();
          }
        });
      } else {
        console.log('Permission denied');
        setLoading(false);
      }
    })();

    return () => {
      appStateListener?.remove();
    };
  }, []);

  //  Loader
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="gray" />
        <Text style={{marginTop: 10}}>Loading photos...</Text>
      </View>
    );
  }

  // 📱 Fullscreen preview with "Next"
  if (selectedPhoto) {
    return (
      <View style={styles.fullscreen}>
        <Image
          source={{uri: selectedPhoto}}
          style={styles.previewImage}
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={() => setSelectedPhoto(null)}
          style={styles.nextButton}>
          <Text style={{color: '#000', fontWeight: '600'}}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedPhoto(null)}
          style={{...styles.nextButton, right: 0}}>
          <Text style={{color: '#000', fontWeight: '600'}}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🧱 Gallery Grid
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recents</Text>

      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        renderItem={({item}) => {
          if (item === 'camera') {
            return (
              <TouchableOpacity onPress={openCamera} style={styles.cameraBox}>
                <Camera size={38} color="grey" />
              </TouchableOpacity>
            );
          }

          const isVideo =
            item.includes('.mp4') ||
            item.includes('.mov') ||
            item.includes('video');
          console.log(item);

          return (
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={async () => {
                if (isVideo) {
                  handleVideoCrop(item); // For now just preview video
                } else {
                  try {
                    const cropped = await ImageCropPicker.openCropper({
                      path: item,
                      width: 1080,
                      height: 1080,
                      cropping: true,
                      freeStyleCropEnabled: true,
                    });
                    setSelectedPhoto(cropped.path);
                  } catch (err) {
                    console.log('Crop cancelled or failed:', err);
                  }
                }
              }}>
              {isVideo ? (
                <View style={styles.playIcon}>
                  <Play size={32} color="#fff" />
                </View>
              ) : (
                <Image source={{uri: item}} style={styles.image} />
              )}
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.flatlistContent}
      />
    </View>
  );
};

export default InstaGallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 12,
  },
  flatlistContent: {
    paddingHorizontal: 8,
  },
  cameraBox: {
    width: '32%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  imageContainer: {
    width: '32%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
    backgroundColor: '#c3c3c3ff',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  fullscreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: '90%',
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    margin: 12,
    borderRadius: 8,
    position: 'absolute',
    bottom: 110,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    position: 'absolute',
    top: '35%',
    left: '35%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 6,
  },
});
