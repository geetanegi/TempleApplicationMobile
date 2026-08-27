import React, {useEffect, useState, useCallback, useRef} from 'react';
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
  Keyboard,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/elements';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Camera, Pencil, Images} from 'lucide-react-native';
import {getUserId} from '../../redux/store/getState';
import {createPost} from '../../utils/apicalls/socialHandler';
import {prefetchImageSize} from '../../utils/imageAspectRatio';

// Gallery item: string (legacy 'camera') or { uri, type: 'photo' }
const InstaGallery = () => {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const {height: screenH} = useWindowDimensions();
  const previewScrollRef = useRef(null);
  // Aspect ratio (w/h) of the picked photo, so the preview shows it whole instead of square-cropped.
  const [previewAspect, setPreviewAspect] = useState(null);
  const [photos, setPhotos] = useState(['camera']);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [caption, setCaption] = useState('');
  const [posting, setPosting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // 0-100 when uploading, null otherwise
  const [loading, setLoading] = useState(true);
  const [extraBottomPad, setExtraBottomPad] = useState(0);

  const ensurePostButtonVisible = useCallback(() => {
    setTimeout(() => {
      previewScrollRef.current?.scrollToEnd({ animated: true });
    }, 80);
  }, []);

  useEffect(() => {
    if (!selectedPhoto) {
      setPreviewAspect(null);
      return;
    }
    let cancelled = false;
    prefetchImageSize(selectedPhoto).then(size => {
      if (!cancelled && size?.width && size?.height) {
        setPreviewAspect(size.width / size.height);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedPhoto]);

  useEffect(() => {
    if (!selectedPhoto) {
      setExtraBottomPad(0);
      return;
    }
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => {
      setExtraBottomPad(88);
      ensurePostButtonVisible();
    });
    const hideSub = Keyboard.addListener(hideEvent, () => setExtraBottomPad(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [selectedPhoto, ensurePostButtonVisible]);

  // 📍 Request permission to access photos
  const requestPhotoPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          );
          return result === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to your photos to create posts',
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

  // Keep client-side compression light; server optimizes to 1080px / high-quality JPEG.
  const imagePickQuality = {
    compressImageMaxWidth: 2048,
    compressImageMaxHeight: 2048,
    compressImageQuality: 0.92,
    forceJpg: true,
  };

  const cropOptions = {
    freeStyleCropEnabled: true,
    cropperToolbarTitle: 'Edit Photo',
    cropperToolbarColor: '#424242',
    cropperToolbarWidgetColor: '#FFFFFF',
    cropperStatusBarLight: false,
    cropperNavigationBarLight: false,
    ...imagePickQuality,
  };

  // 📷 Open camera (photo only). No cropping – use full image as captured.
  const openCamera = async () => {
    try {
      const result = await ImageCropPicker.openCamera({
        cropping: false,
        mediaType: 'photo',
        ...imagePickQuality,
      });
      let path = result.path || result.sourceURL || '';
      // Post photo as-is; cropping available in preview
      setSelectedPhoto(path);
    } catch (err) {
      console.log('Camera error:', err);
    }
  };

  // 🖼️ Open full system gallery (all albums / folders), not just recent CameraRoll items
  const openGallery = async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        cropping: false,
        mediaType: 'photo',
        ...imagePickQuality,
      });
      const path = result?.path || result?.sourceURL || '';
      if (path) {
        setSelectedPhoto(path);
      }
    } catch (err) {
      if (err?.message !== 'User cancelled' && err?.code !== 'E_PICKER_CANCELLED') {
        console.log('Gallery error:', err);
      }
    }
  };

  const clearSelection = () => {
    setSelectedPhoto(null);
    setCaption('');
  };

  // Optional crop - uses already-selected image, no need to pick again
  const handleCropPhoto = useCallback(async () => {
    if (!selectedPhoto) return;
    try {
      const cropped = await ImageCropPicker.openCropper({
        path: selectedPhoto,
        cropping: true,
        ...cropOptions,
      });
      setSelectedPhoto(cropped.path);
    } catch (err) {
      if (err?.message !== 'User cancelled') console.log('Crop cancelled or failed:', err);
    }
  }, [selectedPhoto]);

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
      await createPost(userId, caption, selectedPhoto, 'photo', {
        onUploadProgress: (percent) => setUploadProgress(percent),
      });
      clearSelection();
      navigation.getParent()?.navigate('Profile', {
        screen: 'ProfileMain',
        params: { refreshProfile: true },
      });
      navigation.pop();
    } catch (e) {
      console.warn('Create post error:', e);
      Alert.alert('Error', e?.data?.message || e?.message || 'Failed to create post.');
    } finally {
      setPosting(false);
      setUploadProgress(null);
    }
  };

  // 🖼️ Fetch recent photos from device (quick grid); full gallery via openGallery
  const fetchPhotos = async () => {
    try {
      const items = ['camera', 'gallery'];
      const seen = new Set();

      const addFromEdges = edges => {
        if (!Array.isArray(edges)) return;
        edges.forEach(edge => {
          const node = edge?.node;
          const uri = node?.image?.uri;
          if (!uri || seen.has(uri)) return;
          seen.add(uri);
          items.push({ uri, type: 'photo' });
        });
      };
      const result = await CameraRoll.getPhotos({
        first: 150,
        assetType: 'Photos',
      });
      addFromEdges(result?.edges);

      setPhotos(items);
    } catch (error) {
      console.log('Error loading photos:', error);
      setPhotos(['camera', 'gallery']);
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

  // 📱 Preview with caption and Post
  if (selectedPhoto) {
    return (
      <>
        <KeyboardAvoidingView
          style={styles.previewRoot}
          behavior="padding"
          keyboardVerticalOffset={headerHeight}
        >
          <ScrollView
            ref={previewScrollRef}
            style={styles.previewScroll}
            contentContainerStyle={[
              styles.previewScrollContent,
              { paddingBottom: 32 + extraBottomPad },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.photoPreviewBox}>
              <View
                style={[
                  styles.previewFrame,
                  {
                    aspectRatio: previewAspect || 1,
                    maxHeight: Math.round(screenH * 0.6),
                  },
                ]}
              >
                <Image source={{uri: selectedPhoto}} style={styles.previewImage} resizeMode="contain" />
              </View>
              <Text style={styles.mediaLabel}>Photo</Text>
              <TouchableOpacity
                onPress={handleCropPhoto}
                style={styles.cropBtn}
              >
                <Pencil size={18} color="#D48A4A" strokeWidth={2} />
                <Text style={styles.cropBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.captionLabel}>Caption (optional)</Text>
              <TextInput
                style={styles.captionInput}
                placeholder="Write a caption..."
                placeholderTextColor="#999"
                value={caption}
                onChangeText={setCaption}
                onFocus={ensurePostButtonVisible}
                multiline
                maxLength={500}
              />
            </View>
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
        </KeyboardAvoidingView>

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
      <View style={styles.headerRow}>
        <Text style={styles.header}>Photos</Text>
        <TouchableOpacity onPress={openGallery} hitSlop={8}>
          <Text style={styles.browseLink}>Browse gallery</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={photos}
        keyExtractor={(item, index) =>
          item === 'camera'
            ? 'camera'
            : item === 'gallery'
              ? 'gallery'
              : (item.uri || '') + index
        }
        numColumns={3}
        renderItem={({item}) => {
          if (item === 'camera') {
            return (
              <TouchableOpacity onPress={openCamera} style={styles.cameraBox}>
                <Camera size={32} color="grey" />
                <Text style={styles.tileLabel}>Camera</Text>
              </TouchableOpacity>
            );
          }

          if (item === 'gallery') {
            return (
              <TouchableOpacity onPress={openGallery} style={styles.cameraBox}>
                <Images size={32} color="grey" />
                <Text style={styles.tileLabel}>Gallery</Text>
              </TouchableOpacity>
            );
          }

          const uri = typeof item === 'object' && item?.uri ? item.uri : item;
          return (
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={async () => {
                // Select photo as-is; optional crop available in preview
                setSelectedPhoto(uri);
              }}>
              <Image source={{uri}} style={styles.image} resizeMode="cover" />
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
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingRight: 12,
  },
  browseLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D48A4A',
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
    gap: 6,
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
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
  photoPreviewBox: {
    width: '100%',
    borderRadius: 14,
    marginBottom: 16,
    position: 'relative',
  },
  previewFrame: {
    width: '100%',
    // aspectRatio is set inline from the picked photo so nothing is cropped.
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
    borderWidth: 2,
    borderColor: '#e6e6e6',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  cropBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  cropBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D48A4A',
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
