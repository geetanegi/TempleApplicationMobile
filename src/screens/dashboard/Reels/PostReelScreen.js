import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  launchImageLibrary,
  launchCamera,
} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { X, Film, Video } from 'lucide-react-native';
import { getUserId } from '../../../redux/store/getState';
import { createReel } from '../../../utils/apicalls/reelHandler';
import { colors } from '../../../global/theme';
import VideoThumbnailSelector from '../../../components/VideoThumbnailSelector';

const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

/** Normalize URI for FormData - Android may need file:// prefix for absolute paths */
const normalizeVideoUri = (uri) => {
  if (!uri || typeof uri !== 'string') return null;
  const trimmed = uri.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('file://') || trimmed.startsWith('content://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return 'file://' + trimmed;
  }
  return trimmed;
};

const PostReelScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const fromProfile = route.params?.fromProfile === true;
  const currentUserId = getUserId();
  const [videoUri, setVideoUri] = useState(null);
  const [thumbnailUri, setThumbnailUri] = useState(null);
  const [caption, setCaption] = useState('');
  const [posting, setPosting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const isMounted = useRef(true);

  const handleThumbnailSelect = useCallback((path) => {
    setThumbnailUri(path);
  }, []);

  React.useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          const results = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ]);
          return (
            results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED
          );
        } else {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to your videos to post reels',
              buttonPositive: 'OK',
            }
          );
          return result === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch {
        return false;
      }
    }
    return true;
  };

  const pickVideo = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Permission needed', 'Please allow access to your videos.');
      return;
    }
    try {
      // On Android, use DocumentPicker to avoid "For input string" error from
      // content:// URIs returned by launchImageLibrary (MediaStore ID parsing)
      if (Platform.OS === 'android') {
        const results = await DocumentPicker.pick({
          type: [DocumentPicker.types.video],
          allowMultiSelection: false,
          copyTo: 'cachesDirectory',
        });
        if (!isMounted.current) return;
        const file = results?.[0];
        const size = file?.size;
        if (size != null && size > MAX_VIDEO_SIZE_BYTES) {
          Alert.alert('Video too large', 'You cannot select videos greater than 100 MB. Please choose a smaller video.');
          return;
        }
        const uri = file?.fileCopyUri || file?.uri;
        const normalized = normalizeVideoUri(uri);
        if (normalized) {
          setVideoUri(normalized);
          setThumbnailUri(null);
        }
        return;
      }
      const result = await launchImageLibrary({
        mediaType: 'video',
        videoQuality: 'high',
        durationLimit: 60,
      });
      if (!isMounted.current) return;
      if (result.didCancel) return;
      const asset = result.assets?.[0];
      const size = asset?.fileSize;
      if (size != null && size > MAX_VIDEO_SIZE_BYTES) {
        Alert.alert('Video too large', 'You cannot select videos greater than 100 MB. Please choose a smaller video.');
        return;
      }
      const uri = asset?.uri;
      const normalized = normalizeVideoUri(uri);
      if (normalized) {
        setVideoUri(normalized);
        setThumbnailUri(null);
      } else if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Could not pick video');
      }
    } catch (err) {
      if (isMounted.current && err?.message !== 'User cancelled' && !DocumentPicker.isCancel(err)) {
        Alert.alert('Error', err?.message || 'Could not pick video');
      }
    }
  };

  const openCamera = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Permission needed', 'Please allow camera access to record reels.');
      return;
    }
    try {
      const result = await launchCamera({
        mediaType: 'video',
        videoQuality: 'high',
        durationLimit: 60,
        cameraType: 'back',
      });
      if (!isMounted.current) return;
      if (result.didCancel) return;
      const asset = result.assets?.[0];
      const size = asset?.fileSize;
      if (size != null && size > MAX_VIDEO_SIZE_BYTES) {
        Alert.alert('Video too large', 'You cannot select videos greater than 100 MB. Please choose a smaller video.');
        return;
      }
      const uri = asset?.uri;
      const normalized = normalizeVideoUri(uri);
      if (normalized) {
        setVideoUri(normalized);
        setThumbnailUri(null);
      } else if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Could not record video');
      }
    } catch (err) {
      if (isMounted.current && err?.message !== 'User cancelled') {
        Alert.alert('Error', err?.message || 'Could not record video');
      }
    }
  };

  const handlePost = async () => {
    if (!currentUserId) {
      Alert.alert('Error', 'You must be logged in to post.');
      return;
    }
    if (!videoUri) {
      Alert.alert('Select video', 'Please select or record a video first.');
      return;
    }
    setPosting(true);
    setUploadProgress(0);
    try {
      await createReel(currentUserId, caption, videoUri, {
        thumbnailUri: thumbnailUri || undefined,
        onUploadProgress: (p) => setUploadProgress(p),
      });
      Alert.alert('Success', 'Your reel has been posted!', [
        {
          text: 'OK',
          onPress: () => {
            if (fromProfile) {
              const tabNav = navigation.getParent()?.getParent?.();
              (tabNav || navigation).navigate('Profile', {
                screen: 'ProfileMain',
                params: { activeTab: 'Reels', refreshProfile: true },
              });
            } else {
              navigation.navigate('ReelsFeed');
            }
          },
        },
      ]);
    } catch (e) {
      Alert.alert(
        'Error',
        e?.response?.data?.message || e?.message || 'Failed to post reel'
      );
    } finally {
      setPosting(false);
      setUploadProgress(null);
    }
  };

  const topPadding =
    Platform.OS === 'android' ? Math.max(StatusBar.currentHeight || 0, 48) : 0;

  return (
    <SafeAreaView
      style={[styles.container, topPadding > 0 && { paddingTop: topPadding }]}
      edges={['bottom']}
    >
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <X size={28} color="#000" strokeWidth={2} />
        </Pressable>
        <Text style={styles.headerTitle}>New Clip</Text>
        <Pressable
          onPress={handlePost}
          disabled={posting || !videoUri}
          style={[styles.postBtn, (posting || !videoUri) && styles.postBtnDisabled]}
        >
          {posting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.postBtnText}>Post</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.content}>
        {!videoUri ? (
          <View style={styles.pickArea}>
            <Pressable style={styles.pickBtn} onPress={pickVideo}>
              <Film size={48} color={colors.orange || '#D48A4A'} strokeWidth={2} />
              <Text style={styles.pickLabel}>Choose from gallery</Text>
            </Pressable>
            <Pressable style={styles.pickBtn} onPress={openCamera}>
              <Video size={48} color={colors.orange || '#D48A4A'} strokeWidth={2} />
              <Text style={styles.pickLabel}>Record video</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.previewArea}>
            <Text style={styles.previewLabel}>Video selected</Text>
            <Pressable onPress={pickVideo} style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>Change video</Text>
            </Pressable>
            <VideoThumbnailSelector
              videoUri={videoUri}
              onSelect={handleThumbnailSelect}
            />
          </View>
        )}

        <View style={styles.captionSection}>
          <Text style={styles.captionLabel}>Caption (optional)</Text>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            placeholderTextColor="#999"
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={1000}
          />
        </View>

        {uploadProgress != null && (
          <View style={styles.progressWrap}>
            <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
            <Text style={styles.progressText}>{uploadProgress}%</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  postBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.orange || '#D48A4A',
    borderRadius: 8,
  },
  postBtnDisabled: { opacity: 0.5 },
  postBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  content: { flex: 1, padding: 20 },
  pickArea: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 40 },
  pickBtn: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
  },
  pickLabel: { marginTop: 12, fontSize: 14, fontWeight: '600', color: '#333' },
  previewArea: { marginTop: 20 },
  previewLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
  changeBtn: { marginTop: 8 },
  changeBtnText: { fontSize: 14, color: colors.orange || '#D48A4A', fontWeight: '600' },
  captionSection: { marginTop: 24 },
  captionLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  captionInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#000',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  progressWrap: {
    marginTop: 20,
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.orange || '#D48A4A',
  },
  progressText: { marginTop: 8, fontSize: 12, color: '#666' },
});

export default PostReelScreen;
