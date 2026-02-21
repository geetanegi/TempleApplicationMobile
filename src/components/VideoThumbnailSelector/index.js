import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import { createThumbnail } from 'react-native-create-thumbnail';

const STEPS = 8; // number of thumbnail options

const COLORS = {
  orange: '#D48A4A',
  text: '#1B1B1B',
  sub: '#7A7A7A',
  border: '#E7E0DA',
  borderSelected: '#D48A4A',
};

/**
 * Generates thumbnails from video at evenly spaced times (based on duration).
 * Uses react-native-video to get duration, then react-native-create-thumbnail for frames.
 * @param {string} videoUri - Local video file URI (file:// or content://)
 * @param {(path: string | null, index: number) => void} onSelect - Called when user selects; path=local file path
 */
export default function VideoThumbnailSelector({ videoUri, onSelect }) {
  const [videoDurationMs, setVideoDurationMs] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  // Get duration from Video onLoad
  const handleVideoLoaded = useCallback((meta) => {
    if (meta?.duration != null && meta.duration > 0) {
      const durationMs = meta.duration * 1000;
      setVideoDurationMs(durationMs);
    } else {
      // Fallback: use a default duration (e.g. 10s) if meta is invalid
      setVideoDurationMs(10000);
    }
  }, []);

  const handleVideoError = useCallback(() => {
    if (mounted.current) {
      setVideoDurationMs(10000); // fallback to 10s
    }
  }, []);

  // Generate thumbnails when we have both uri and duration
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!videoUri || typeof videoUri !== 'string') {
      setLoading(false);
      setVideoDurationMs(null);
      setThumbnails([]);
      return;
    }
    setVideoDurationMs(null);
    setThumbnails([]);
    setError(null);
    setLoading(true);

    // Fallback: if Video onLoad doesn't fire within 8s, use 10s duration
    const timeout = setTimeout(() => {
      setVideoDurationMs((prev) => (prev == null ? 10000 : prev));
    }, 8000);
    return () => clearTimeout(timeout);
  }, [videoUri]);

  useEffect(() => {
    const generateThumbnails = async () => {
      if (!videoUri || !videoDurationMs) return;

      setLoading(true);
      setError(null);
      try {
        const items = [];
        const effectiveDuration = Math.max(500, videoDurationMs - 200);

        for (let i = 0; i < STEPS; i++) {
          if (!mounted.current) return;
          const divisor = STEPS > 1 ? STEPS - 1 : 1;
          const timeMs = Math.floor((effectiveDuration / divisor) * i);

          try {
            const res = await createThumbnail({
              url: videoUri,
              timeStamp: timeMs,
              format: 'jpeg',
              maxWidth: 256,
              maxHeight: 256,
            });

            if (res?.path) {
              items.push({
                id: `t${timeMs}`,
                path: res.path,
                timeMs,
              });
            }
          } catch (e) {
            // Skip this frame
          }
        }

        if (mounted.current) {
          setThumbnails(items);
          setLoading(false);
          if (items.length === 0) {
            setError('Could not generate thumbnails');
            onSelect?.(null, -1);
          } else {
            setSelectedIndex(0);
            onSelect?.(items[0].path, 0);
          }
        }
      } catch (e) {
        if (mounted.current) {
          setError('Could not generate thumbnails');
          setLoading(false);
          onSelect?.(null, -1);
        }
      }
    };

    if (videoDurationMs != null && videoDurationMs > 0) {
      generateThumbnails();
    }
  }, [videoUri, videoDurationMs]);

  useEffect(() => {
    if (thumbnails.length > 0 && selectedIndex >= 0 && selectedIndex < thumbnails.length) {
      onSelect?.(thumbnails[selectedIndex].path, selectedIndex);
    }
  }, [selectedIndex]);

  const handleSelect = (item, idx) => {
    setSelectedIndex(idx);
    onSelect?.(item.path, idx);
  };

  // Hidden Video to load and get duration (must be rendered for onLoad to fire)
  const videoElement = videoUri ? (
    <Video
      source={{ uri: videoUri }}
      style={styles.hiddenVideo}
      resizeMode="contain"
      onLoad={handleVideoLoaded}
      onError={handleVideoError}
      muted
      paused
    />
  ) : null;

  if (loading && thumbnails.length === 0) {
    return (
      <View style={styles.root}>
        {videoElement}
        <Text style={styles.label}>Select thumbnail</Text>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={COLORS.orange} />
          <Text style={styles.loadingText}>
            {videoDurationMs == null ? 'Loading video...' : 'Generating thumbnails...'}
          </Text>
        </View>
      </View>
    );
  }

  if (error || thumbnails.length === 0) {
    return (
      <View style={styles.root}>
        {videoElement}
        <Text style={styles.label}>Select thumbnail</Text>
        <Text style={styles.errorText}>{error || 'No thumbnails available'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {videoElement}
      <Text style={styles.label}>Select thumbnail (first is default)</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {thumbnails.map((item, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <Pressable
              key={item.id}
              style={[styles.thumbWrap, isSelected && styles.thumbWrapSelected]}
              onPress={() => handleSelect(item, idx)}
            >
              <Image source={{ uri: item.path }} style={styles.thumbImg} resizeMode="cover" />
              <Text style={styles.thumbTime}>
                {(item.timeMs / 1000).toFixed(1)}s
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { marginTop: 20 },
  hiddenVideo: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    left: -9999,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  loadingText: { fontSize: 14, color: COLORS.sub },
  errorText: { fontSize: 14, color: '#c00', marginTop: 8 },
  scrollContent: {
    flexDirection: 'row',
    gap: 10,
  },
  thumbWrap: {
    width: 80,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  thumbWrapSelected: {
    borderColor: COLORS.borderSelected,
  },
  thumbImg: {
    width: 80,
    height: 80,
  },
  thumbTime: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    fontSize: 10,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    overflow: 'hidden',
  },
});
