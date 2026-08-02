import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  Modal,
  FlatList,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera as VisionCamera, useCameraDevice } from 'react-native-vision-camera';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import ImageCropPicker from 'react-native-image-crop-picker';
import {
  X,
  Zap,
  ZapOff,
  Camera,
  RefreshCw,
  ImagePlus,
  Check,
  Pencil,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import { colors } from '../../../global/theme';
import { createStory } from '../../../utils/apicalls/socialHandler';
import { getUserId } from '../../../redux/store/getState';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const RECENT_PHOTOS_COUNT = 20;
const GALLERY_PHOTOS_COUNT = 100;
const THUMB_SIZE = 64;

/** Edit/crop options – free aspect ratio, same as post Create screen */
const STORY_EDIT_OPTIONS = {
  freeStyleCropEnabled: true,
  compressImageMaxWidth: 1080,
  compressImageMaxHeight: 1920,
  compressImageQuality: 0.9,
};


const requestCameraPermission = async () => {
  if (Platform.OS !== 'android') return true;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'This app needs camera access to take photos for your story.',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (e) {
    return false;
  }
};

const requestGalleryPermission = async () => {
  if (Platform.OS !== 'android') return true;
  try {
    if (Platform.Version >= 33) {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      ]);
      return results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED;
    }
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Photo Library',
        message: 'This app needs access to your photos to choose images for your story.',
        buttonPositive: 'OK',
      }
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (e) {
    return false;
  }
};

const StoryUploadScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef(null);

  const [cameraAllowed, setCameraAllowed] = useState(null);
  const [galleryAllowed, setGalleryAllowed] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const [facing, setFacing] = useState('back');
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryModalVisible, setGalleryModalVisible] = useState(false);
  const [mode, setMode] = useState('camera'); // 'camera' | 'preview'
  const [previewUri, setPreviewUri] = useState(null);
  const [captionText, setCaptionText] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [uploading, setUploading] = useState(false);

  const device = useCameraDevice(facing);

  useEffect(() => {
    (async () => {
      const cam = await requestCameraPermission();
      setCameraAllowed(cam);
      if (!cam) {
        Alert.alert('Permission needed', 'Camera access is required to add a story.');
        return;
      }
      const gal = await requestGalleryPermission();
      setGalleryAllowed(gal);
      if (gal) loadRecentPhotos();
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowSwipeHint(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const loadRecentPhotos = useCallback(async () => {
    try {
      const result = await CameraRoll.getPhotos({
        first: RECENT_PHOTOS_COUNT,
        assetType: 'Photos',
      });
      const uris = result.edges.map((e) => e.node.image.uri);
      setRecentPhotos(uris);
    } catch (e) {
      console.warn('Recent photos load failed', e);
    }
  }, []);

  const loadGalleryPhotos = useCallback(async () => {
    try {
      const result = await CameraRoll.getPhotos({
        first: GALLERY_PHOTOS_COUNT,
        assetType: 'Photos',
      });
      const uris = result.edges.map((e) => e.node.image.uri);
      setGalleryPhotos(uris);
    } catch (e) {
      console.warn('Gallery load failed', e);
    }
  }, []);

  const openGalleryModal = useCallback(async () => {
    if (!galleryAllowed) {
      const gal = await requestGalleryPermission();
      setGalleryAllowed(gal);
      if (!gal) {
        Alert.alert('Permission needed', 'Photo library access is required to choose a photo.');
        return;
      }
    }
    await loadGalleryPhotos();
    setGalleryModalVisible(true);
  }, [galleryAllowed, loadGalleryPhotos]);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePhoto({
        flash: flashOn ? 'on' : 'off',
      });
      // VisionCamera returns a bare filesystem path, not a URI.
      if (photo?.path) {
        setPreviewUri(`file://${photo.path}`);
        setMode('preview');
        setCaptionText('');
      }
    } catch (e) {
      console.warn('Capture failed', e);
      Toast.show('Could not capture photo');
    } finally {
      setCapturing(false);
    }
  }, [capturing, flashOn]);

  const onSelectPhoto = useCallback((uri) => {
    setPreviewUri(uri);
    setMode('preview');
    setCaptionText('');
    setGalleryModalVisible(false);
  }, []);

  const cancelPreview = useCallback(() => {
    setPreviewUri(null);
    setMode('camera');
    setCaptionText('');
  }, []);

  // Edit/crop – same as Create Post. Use openPicker with cropping as fallback since
  // openCropper can crash on some Android devices with camera/gallery URIs.
  const handleEditPress = useCallback(async () => {
    if (!previewUri) return;
    try {
      const result = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        ...STORY_EDIT_OPTIONS,
      });
      const resultPath = result?.path || result?.sourceURL;
      if (resultPath) {
        const uri = resultPath.startsWith('file://') ? resultPath : `file://${resultPath}`;
        setPreviewUri(uri);
      }
    } catch (e) {
      if (e?.message !== 'User cancelled' && e?.code !== 'E_PICKER_CANCELLED') {
        Toast.show('Could not edit photo');
      }
    }
  }, [previewUri]);

  const submitStory = useCallback(async () => {
    if (!previewUri || uploading) return;
    const userId = getUserId();
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to post a story.');
      return;
    }
    setUploading(true);
    try {
      await createStory(userId, 'IMAGE', previewUri);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Upload failed', e?.data?.message || e?.message || 'Could not post story.');
    } finally {
      setUploading(false);
    }
  }, [previewUri, uploading, navigation]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        const { dy } = gestureState;
        if (dy < -60) openGalleryModal();
      },
    })
  ).current;

  if (cameraAllowed === null) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator size="large" color={colors.orange} />
        <Text style={styles.permissionText}>Checking permissions…</Text>
      </View>
    );
  }

  if (cameraAllowed === false) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <Text style={styles.permissionText}>Camera access is required.</Text>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  // Preview mode: show image with top actions and caption bar
  if (mode === 'preview' && previewUri) {
    return (
      <View style={styles.screen}>
        <Image source={{ uri: previewUri }} style={styles.previewImage} resizeMode="contain" />

        <View style={[styles.previewTopBar, { paddingTop: insets.top + 8 }]}>
          <View style={styles.previewTopRight}>
            <Pressable style={styles.iconBtn} onPress={handleEditPress}>
              <Pencil size={24} color="#fff" />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={cancelPreview}>
              <X size={28} color="#fff" />
            </Pressable>
          </View>
        </View>

        <View
          style={[
            styles.captionBar,
            { paddingBottom: 12 + Math.max(insets.bottom, 20) },
          ]}
        >
          <View style={styles.captionInputWrap}>
            <ImagePlus size={20} color={colors.PRIMARY_LIGHT_TEXT} />
            <TextInput
              style={styles.captionInput}
              placeholder="add a caption.."
              placeholderTextColor={colors.SEARCH_TEXT_COLOR}
              value={captionText}
              onChangeText={setCaptionText}
            />
          </View>
          <Pressable
            style={[styles.checkBtn, uploading && styles.checkBtnDisabled]}
            onPress={submitStory}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={colors.DARK_BLACK} />
            ) : (
              <Check size={24} color={colors.DARK_BLACK} strokeWidth={2.5} />
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  // Camera mode
  return (
    <View style={styles.screen}>
      {device && (
        <VisionCamera
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          device={device}
          // Release the camera while the gallery sheet covers the preview.
          isActive={mode === 'camera' && !galleryModalVisible}
          photo={true}
          audio={false}
        />
      )}

      {/* Back button */}
      <Pressable
        style={[styles.backButton, { top: insets.top + 12 }]}
        onPress={() => navigation.goBack()}
      >
        <X size={28} color="#fff" />
      </Pressable>

      {/* Swipe-up area to open gallery - large touchable area */}
      <View style={styles.swipeArea} {...panResponder.panHandlers}>
        {showSwipeHint && (
          <Text style={styles.swipeHint}>Swipe up for gallery</Text>
        )}
      </View>

      {/* Recent photos row */}
      {recentPhotos.length > 0 && (
        <View style={[styles.recentRow, { bottom: 120 + insets.bottom }]}>
          <FlatList
            data={recentPhotos}
            horizontal
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentList}
            renderItem={({ item }) => (
              <Pressable style={styles.thumbWrap} onPress={() => onSelectPhoto(item)}>
                <Image source={{ uri: item }} style={styles.thumb} />
              </Pressable>
            )}
          />
        </View>
      )}

      {/* Bottom controls */}
      <View style={[styles.controls, { paddingBottom: 24 + insets.bottom }]}>
        <Pressable
          style={styles.controlBtn}
          onPress={() => setFlashOn((v) => !v)}
        >
          {flashOn ? (
            <Zap size={28} color={colors.orange} fill={colors.orange} />
          ) : (
            <ZapOff size={28} color="#fff" />
          )}
        </Pressable>
        <Pressable
          style={[styles.captureBtn, capturing && styles.captureBtnDisabled]}
          onPress={takePicture}
          disabled={capturing}
        >
          {capturing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View style={styles.captureInner} />
          )}
        </Pressable>
        <Pressable
          style={styles.controlBtn}
          onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
        >
          <RefreshCw size={28} color="#fff" />
        </Pressable>
      </View>

      {/* Full gallery modal (swipe up / open gallery) */}
      <Modal
        visible={galleryModalVisible}
        animationType="slide"
        onRequestClose={() => setGalleryModalVisible(false)}
      >
        <View style={[styles.galleryModal, { paddingTop: insets.top }]}>
          <View style={styles.galleryHeader}>
            <Text style={styles.galleryTitle}>Recent photos</Text>
            <Pressable onPress={() => setGalleryModalVisible(false)} style={styles.closeModalBtn}>
              <X size={28} color={colors.DARK_BLACK} />
            </Pressable>
          </View>
          <FlatList
            data={galleryPhotos}
            numColumns={3}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.galleryGrid}
            renderItem={({ item }) => (
              <Pressable
                style={styles.galleryItem}
                onPress={() => onSelectPhoto(item)}
              >
                <Image source={{ uri: item }} style={styles.galleryImage} />
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default StoryUploadScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.orange,
    borderRadius: 12,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 80,
    bottom: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1,
  },
  swipeHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  recentRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: THUMB_SIZE + 16,
  },
  recentList: {
    paddingHorizontal: 12,
    gap: 8,
  },
  thumbWrap: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  controlBtn: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnDisabled: {
    opacity: 0.7,
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
  previewImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  previewTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
  },
  previewTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    gap: 12,
  },
  captionInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    gap: 10,
  },
  captionInput: {
    flex: 1,
    fontSize: 15,
    color: colors.DARK_BLACK,
    paddingVertical: 0,
  },
  checkBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.PRIMARY_BUTTON,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBtnDisabled: {
    opacity: 0.7,
  },
  galleryModal: {
    flex: 1,
    backgroundColor: colors.white,
  },
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.DARK_BLACK,
  },
  closeModalBtn: {
    padding: 8,
  },
  galleryGrid: {
    padding: 4,
    paddingBottom: 40,
  },
  galleryItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 4,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});
