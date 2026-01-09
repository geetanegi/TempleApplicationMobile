import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Linking,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../../global/theme';

const {width, height} = Dimensions.get('window');

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
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayVideo = async () => {
    if (!videoId) {
      setError('Invalid video ID');
      return;
    }

    try {
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      // Try YouTube app first
      const youtubeAppUrl = `youtube://watch?v=${videoId}`;
      const canOpen = await Linking.canOpenURL(youtubeAppUrl);
      
      if (canOpen) {
        await Linking.openURL(youtubeAppUrl);
      } else {
        // Fallback to browser
        await Linking.openURL(youtubeUrl);
      }
    } catch (err) {
      console.error('Error opening video:', err);
      setError('Unable to open video');
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {video?.title || 'Video Player'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Video Player Area */}
        <View style={styles.playerContainer}>
          {videoId ? (
            <>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={styles.loadingText}>Loading video...</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.videoThumbnailContainer}
                  onPress={handlePlayVideo}
                  activeOpacity={0.9}>
                  {thumbnailUrl && (
                    <Image
                      source={{uri: thumbnailUrl}}
                      style={styles.thumbnailImage}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.playButtonOverlay}>
                    <View style={styles.playButton}>
                      <Ionicons name="play" size={40} color="#fff" />
                    </View>
                  </View>
                  <View style={styles.youtubeBadge}>
                    <Ionicons name="logo-youtube" size={20} color="#fff" />
                    <Text style={styles.youtubeText}>YouTube</Text>
                  </View>
                </TouchableOpacity>
              )}
              {error && (
                <View style={styles.errorOverlay}>
                  <Ionicons name="alert-circle" size={32} color="#ff4444" />
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setError(null);
                      handlePlayVideo();
                    }}
                    style={styles.retryButton}>
                    <Text style={styles.retryText}>Try Again</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={48} color="#ff4444" />
              <Text style={styles.errorText}>
                Invalid YouTube URL
              </Text>
              <Text style={styles.errorSubtext}>
                Please check the video link
              </Text>
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
        
        {/* Spacer for bottom tab bar */}
        <View style={styles.bottomSpacer} />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginHorizontal: 12,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  playerContainer: {
    width: width,
    height: (width * 9) / 16, // 16:9 aspect ratio
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoThumbnailContainer: {
    width: width,
    height: (width * 9) / 16,
    backgroundColor: '#000',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  youtubeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  youtubeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#ff4444',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    height: 100, // Space for bottom tab bar
  },
});
