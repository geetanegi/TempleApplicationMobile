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
  TextInput,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Camera, Play} from 'lucide-react-native';
import {getUserId} from '../../redux/store/getState';
import {createPost} from '../../utils/apicalls/socialHandler';

const isVideoUri = uri => {
  if (!uri || typeof uri !== 'string') return false;
  const u = uri.toLowerCase();
  return u.includes('.mp4') || u.includes('.mov') || u.includes('video');
};

// Gallery item: string (legacy 'camera') or { uri, type: 'photo'|'video' }
const InstaGallery = () => {
  const navigation = useNavigation();
  const [photos, setPhotos] = useState(['camera']);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedIsVideo, setSelectedIsVideo] = useState(false);
  const [caption, setCaption] = useState('');
  const [posting, setPosting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // 0-100 when uploading, null otherwise
  const [loading, setLoading] = useState(true);

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
              message: 'App needs access to your photos and videos to create posts',
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

  // Cropping only; compression is done on the backend (Java).
  const cropOptions = { width: 1080, height: 1080 };

  // 📷 Open camera (photo or video). cropping: false so video capture is allowed.
  const openCamera = async () => {
    try {
      const result = await ImageCropPicker.openCamera({
        width: 1080,
        height: 1080,
        cropping: false,
        mediaType: 'any',
      });
      let path = result.path || result.sourceURL || '';
      let isVideo = isVideoUri(path) || result.mime?.includes('video');
      if (!isVideo && path) {
        try {
          const cropped = await ImageCropPicker.openCropper({
            path,
            ...cropOptions,
            cropping: true,
            freeStyleCropEnabled: true,
          });
          path = cropped.path;
        } catch (e) {
          if (e?.message !== 'User cancelled') console.log('Crop after camera:', e);
        }
      }
      setSelectedIsVideo(!!isVideo);
      setSelectedPhoto(path);
    } catch (err) {
      console.log('Camera error:', err);
    }
  };

  const clearSelection = () => {
    setSelectedPhoto(null);
    setSelectedIsVideo(false);
    setCaption('');
  };

  const handlePost = async () => {
    const userId = getUserId();
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to post.');
      return;
    }
    if (!selectedPhoto) return;
    setPosting(true);
    setUploadProgress(0);
    try {
      await createPost(userId, caption, selectedPhoto, selectedIsVideo ? 'video' : 'photo', {
        onUploadProgress: (percent) => setUploadProgress(percent),
      });
      clearSelection();
      navigation.goBack();
    } catch (e) {
      console.warn('Create post error:', e);
      Alert.alert('Error', e?.data?.message || e?.message || 'Failed to create post.');
    } finally {
      setPosting(false);
      setUploadProgress(null);
    }
  };

  // 🖼️ Fetch photos and videos from device gallery (both shown in grid)
  const fetchPhotos = async () => {
    try {
      const items = ['camera'];
      const seen = new Set();

      const addFromEdges = (edges, defaultType) => {
        if (!Array.isArray(edges)) return;
        edges.forEach(edge => {
          const node = edge?.node;
          const uri = node?.image?.uri;
          if (!uri || seen.has(uri)) return;
          seen.add(uri);
          const nodeType = (node.type || '').toLowerCase();
          const isVideo = defaultType === 'video' || nodeType === 'video' || isVideoUri(uri);
          items.push({ uri, type: isVideo ? 'video' : 'photo' });
        });
      };

      try {
        const result = await CameraRoll.getPhotos({
          first: 150,
          assetType: 'All',
        });
        addFromEdges(result?.edges, null);
      } catch (allError) {
        console.log('getPhotos(All) failed, trying Photos + Videos separately:', allError?.message);
        const [photosResult, videosResult] = await Promise.all([
          CameraRoll.getPhotos({ first: 100, assetType: 'Photos' }),
          CameraRoll.getPhotos({ first: 100, assetType: 'Videos' }),
        ]);
        addFromEdges(photosResult?.edges, 'photo');
        addFromEdges(videosResult?.edges, 'video');
      }

      setPhotos(items);
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
        <Text style={{marginTop: 10}}>Loading photos & videos...</Text>
      </View>
    );
  }

  // 📱 Preview with caption and Post
  if (selectedPhoto) {
    return (
      <>
        <View style={styles.previewRoot}>
          <ScrollView style={styles.previewScroll} contentContainerStyle={styles.previewScrollContent}>
            {selectedIsVideo ? (
              <View style={styles.videoPreviewBox}>
                <Image source={{uri: selectedPhoto}} style={styles.previewThumb} resizeMode="cover" />
                <View style={styles.playOverlay}>
                  <Play size={40} color="#fff" />
                </View>
                <Text style={styles.mediaLabel}>Video</Text>
              </View>
            ) : (
              <View style={styles.photoPreviewBox}>
                <Image source={{uri: selectedPhoto}} style={styles.previewImage} resizeMode="contain" />
                <Text style={styles.mediaLabel}>Photo</Text>
              </View>
            )}
            <Text style={styles.captionLabel}>Caption (optional)</Text>
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption..."
              placeholderTextColor="#999"
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={500}
            />
            <View style={styles.previewActions}>
              <TouchableOpacity onPress={clearSelection} style={styles.previewBtn}>
                <Text style={styles.previewBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePost}
                disabled={posting}
                style={[styles.previewBtn, styles.postBtn]}>
                {posting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[styles.previewBtnText, styles.postBtnText]}>Post</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <Modal visible={posting} transparent animationType="fade">
          <View style={styles.progressOverlay}>
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>Publishing...</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${uploadProgress ?? 0}%` }]} />
              </View>
              <Text style={styles.progressPercent}>{uploadProgress ?? 0}%</Text>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  // 🧱 Gallery Grid
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recents</Text>

      <FlatList
        data={photos}
        keyExtractor={(item, index) => (item === 'camera' ? 'camera' : (item.uri || '') + index)}
        numColumns={3}
        renderItem={({item}) => {
          if (item === 'camera') {
            return (
              <TouchableOpacity onPress={openCamera} style={styles.cameraBox}>
                <Camera size={38} color="grey" />
              </TouchableOpacity>
            );
          }

          const uri = typeof item === 'object' && item?.uri ? item.uri : item;
          const isVideo = (typeof item === 'object' && item?.type === 'video') || isVideoUri(uri);

          return (
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={async () => {
                if (isVideo) {
                  setSelectedIsVideo(true);
                  setSelectedPhoto(uri);
                } else {
                  try {
                    const cropped = await ImageCropPicker.openCropper({
                      path: uri,
                      ...cropOptions,
                      cropping: true,
                      freeStyleCropEnabled: true,
                    });
                    setSelectedIsVideo(false);
                    setSelectedPhoto(cropped.path);
                  } catch (err) {
                    console.log('Crop cancelled or failed:', err);
                  }
                }
              }}>
              <Image source={{uri}} style={styles.image} resizeMode="cover" />
              {isVideo ? (
                <View style={styles.playIcon}>
                  <Play size={32} color="#fff" />
                </View>
              ) : null}
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
    overflow: 'hidden',
    position: 'relative',
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
  previewRoot: {
    flex: 1,
    backgroundColor: '#fff',
  },
  previewScroll: {
    flex: 1,
  },
  previewScrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  videoPreviewBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111',
    marginBottom: 16,
    position: 'relative',
  },
  previewThumb: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  photoPreviewBox: {
    width: '100%',
    minHeight: 280,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    minHeight: 280,
    aspectRatio: 1,
  },
  mediaLabel: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  captionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
    color: '#000',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  previewBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  previewBtnText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  postBtn: {
    backgroundColor: '#D48A4A',
  },
  postBtnText: {
    color: '#fff',
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
  progressOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    minWidth: 260,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#D48A4A',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 14,
    color: '#666',
  },
});
