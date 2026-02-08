import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ArrowLeft} from 'lucide-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');
const PLAYER_HEIGHT = Math.round((width * 9) / 16);

// Extra top margin so header sits below status/notification bar (Android)
const TOP_INSET =
  Platform.OS === 'android'
    ? (StatusBar.currentHeight ?? 28) + 8
    : 12;

// Function to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  if (!url) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function YouTubePlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {video} = route.params || {};

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const videoId = getYouTubeVideoId(video?.youtubeUrl);

  const onReady = useCallback(() => {
    setIsLoading(false);
  }, []);

  const onChangeState = useCallback((state) => {
    // Optional: handle state changes (playing, paused, ended, etc.)
  }, []);

  const onError = useCallback((err) => {
    setIsLoading(false);
    setError('Failed to load video. Please try again.');
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={[styles.safeArea, {paddingTop: TOP_INSET}]}>
        {/* Fixed top header with back button - visible on black */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.8}
            hitSlop={{top: 16, bottom: 16, left: 16, right: 16}}>
            <View style={styles.backButtonInner}>
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.backLabel}>Back</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {video?.title || 'Video Player'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content below header */}
        <View style={styles.content}>
        {/* In-app YouTube player (no external app) */}
        <View style={styles.playerContainer}>
          {videoId ? (
            <>
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={styles.loadingText}>Loading video...</Text>
                </View>
              )}
              {error ? (
                <View style={styles.errorOverlay}>
                  <Ionicons name="alert-circle" size={32} color="#ff4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : (
                <YoutubePlayer
                  height={PLAYER_HEIGHT}
                  play={true}
                  videoId={videoId}
                  onChangeState={onChangeState}
                  onReady={onReady}
                  onError={onError}
                  forceAndroidAutoplay={Platform.OS === 'android'}
                  initialPlayerParams={{
                    preventFullScreen: false,
                    controls: true,
                    rel: false,
                  }}
                />
              )}
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={48} color="#ff4444" />
              <Text style={styles.errorText}>Invalid YouTube URL</Text>
              <Text style={styles.errorSubtext}>Please check the video link</Text>
            </View>
          )}
        </View>

        {/* Video Info */}
        {video && (
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{video.title}</Text>
            <Text style={styles.videoMetadata}>
              {video.channelName} • {video.views} views • {video.timeAgo}
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 52,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    zIndex: 10,
    elevation: 10,
  },
  backButton: {
    padding: 4,
  },
  backButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    minWidth: 88,
  },
  backLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginHorizontal: 8,
    textAlign: 'center',
  },
  placeholder: {
    minWidth: 80,
  },
  content: {
    flex: 1,
  },
  playerContainer: {
    width: width,
    minHeight: PLAYER_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 1,
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 14,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  videoInfo: {
    padding: 16,
    backgroundColor: '#000',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  videoMetadata: {
    fontSize: 14,
    color: '#888',
  },
  bottomSpacer: {
    height: 24, // Bottom safe area (tab bar hidden on this screen)
  },
});
