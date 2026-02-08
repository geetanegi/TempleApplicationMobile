import React, { useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, ImagePlus, Check } from 'lucide-react-native';
import { colors } from '../../../global/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAIN_IMAGE_HEIGHT = SCREEN_HEIGHT * 0.5;
const THUMB_SIZE = 80;

const DEFAULT_PHOTOS = [
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop&q=80',
];

const TempleDetails = () => {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const temple = route.params?.temple || {};
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [captionText, setCaptionText] = useState('');
  const [captions, setCaptions] = useState({});
  const previewListRef = useRef(null);

  const photos = useMemo(() => {
    if (temple.photos && temple.photos.length > 0) return temple.photos;
    return [temple.image || DEFAULT_PHOTOS[0], ...DEFAULT_PHOTOS.slice(1)];
  }, [temple.image, temple.photos]);

  const description =
    temple.description ||
    'A peaceful place of worship and community. Visit for darshan and spiritual solace.';

  const openPreview = index => {
    setPreviewIndex(index);
    setCaptionText(captions[index] || '');
    setPreviewVisible(true);
    setTimeout(() => {
      previewListRef.current?.scrollToIndex({ index, animated: false });
    }, 100);
  };

  const closePreview = () => {
    setPreviewVisible(false);
    setCaptionText('');
  };

  const onPreviewSwipe = e => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setPreviewIndex(index);
    setCaptionText(captions[index] || '');
  };

  const addCaption = () => {
    if (captionText.trim()) {
      setCaptions(prev => ({ ...prev, [previewIndex]: captionText.trim() }));
      setCaptionText('');
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: photos[0] }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        <View style={styles.body}>
          <Text style={styles.templeName}>{temple.name || 'Temple'}</Text>
          <Text style={styles.description}>{description}</Text>

          <Text style={styles.sectionTitle}>More photos</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailsRow}
          >
            {photos.map((uri, index) => (
              <Pressable
                key={`${uri}-${index}`}
                style={styles.thumbWrap}
                onPress={() => openPreview(index)}
              >
                <Image
                  source={{ uri }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={closePreview}
      >
        <View style={styles.previewOverlay}>
          <Pressable
            style={[styles.closeBtn, { top: insets.top + 10 }]}
            onPress={closePreview}
          >
            <X size={28} color="#fff" strokeWidth={2.5} />
          </Pressable>

          <FlatList
            ref={previewListRef}
            data={photos}
            horizontal
            pagingEnabled
            onMomentumScrollEnd={onPreviewSwipe}
            keyExtractor={(_, i) => String(i)}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            initialScrollIndex={previewIndex}
            renderItem={({ item }) => (
              <View style={styles.previewImageWrap}>
                <Image
                  source={{ uri: item }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />

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
            <Pressable style={styles.checkBtn} onPress={addCaption}>
              <Check size={24} color={colors.DARK_BLACK} strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TempleDetails;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mainImage: {
    width: SCREEN_WIDTH,
    height: MAIN_IMAGE_HEIGHT,
    backgroundColor: colors.BACKGROUD_ICON_COLOR,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  templeName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.DARK_BLACK,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.PRIMARY_LIGHT_TEXT,
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.DARK_BLACK,
    marginBottom: 12,
  },
  thumbnailsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
  },
  thumbWrap: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImageWrap: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 120,
    justifyContent: 'center',
  },
  previewImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 200,
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
    paddingBottom: 46,
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
});
