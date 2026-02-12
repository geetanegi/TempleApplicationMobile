import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Menu, Bell, MessageCircle} from 'lucide-react-native';
import HeaderDashboard from '../../../components/dashboardHeader';
import {colors} from '../../../global/theme';

const COLORS = {
  orange: '#D48A4A',
  icon: '#B07C57',
  text: '#1B1B1B',
  sub: '#7A7A7A',
  line: '#E7E0DA',
  bg: '#FFFFFF',
  shadow: 'rgba(0,0,0,0.12)',
  filterActive: '#000000',
  filterInactive: '#F5F5F5',
};

// Function to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Function to generate thumbnail URL from video URL
const generateThumbnailFromUrl = (videoUrl, existingThumbnail = null) => {
  // If thumbnail already exists, use it
  if (existingThumbnail) {
    return existingThumbnail;
  }
  
  // Try to generate YouTube thumbnail
  if (videoUrl) {
    const videoId = getYouTubeVideoId(videoUrl);
    if (videoId) {
      // Try maxresdefault first (highest quality)
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }
  
  // Return null if we can't generate a thumbnail
  return null;
};

// Function to get fallback thumbnail URL (hqdefault)
const getFallbackThumbnail = (videoUrl) => {
  if (videoUrl) {
    const videoId = getYouTubeVideoId(videoUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }
  return null;
};

// Category filters
const categories = [
  'All',
  'New to you',
  'History of jainism religion',
  'Spiritual',
  'Temples',
  'Festivals',
  'Prayers',
];

// Dummy data - replace with your API data
const videosData = [
  {
    id: '1',
    thumbnail:
      'https://i3.ytimg.com/vi/tYe_WO-mWrI?si=eRxmZgSHY6d16wal/maxresdefault.jpg',
    channelAvatar: 'https://randomuser.me/api/portraits/men/31.jpg',
    title: 'History of jainism religion from Season 1 | Jainsansaar',
    channelName: 'Bhakti',
    views: '200k',
    timeAgo: '2 days ago',
    type: 'video',
    youtubeUrl: 'https://youtu.be/7nGNhvxMj3k?si=AgJncRBDPOSbGd21',
  },
  {
    id: '2',
    thumbnail:
    'https://i3.ytimg.com/vi/tYe_WO-mWrI?si=eRxmZgSHY6d16wal/maxresdefault.jpg',
  channelAvatar: 'https://randomuser.me/api/portraits/men/31.jpg',
    title: 'Understanding Jain Philosophy and Principles',
    channelName: 'Spiritual Path',
    views: '150k',
    timeAgo: '5 days ago',
    type: 'video',
    youtubeUrl: 'https://youtu.be/7nGNhvxMj3k?si=AgJncRBDPOSbGd21', // Replace with actual YouTube URL
  },
  {
    id: '3',
    thumbnail:
      'https://i3.ytimg.com/vi/tYe_WO-mWrI?si=eRxmZgSHY6d16wal/maxresdefault.jpg',
    channelAvatar: 'https://randomuser.me/api/portraits/men/31.jpg',
    channelAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    title: 'Temple Architecture: A Journey Through Time',
    channelName: 'Heritage',
    views: '89k',
    timeAgo: '1 week ago',
    type: 'video',
    youtubeUrl: 'https://youtu.be/7nGNhvxMj3k?si=AgJncRBDPOSbGd21',// Replace with actual YouTube URL
  },
  {
    id: '4',
    thumbnail:
      'https://i3.ytimg.com/vi/tYe_WO-mWrI?si=eRxmZgSHY6d16wal/maxresdefault.jpg',
    channelAvatar: 'https://randomuser.me/api/portraits/men/31.jpg',
    title: 'Festival Celebrations: Paryushan Parva',
    channelName: 'Jain Festivals',
    views: '320k',
    timeAgo: '3 days ago',
    type: 'reel',
    youtubeUrl: 'https://youtu.be/7nGNhvxMj3k?si=AgJncRBDPOSbGd21',// Replace with actual YouTube URL
  },
  // {
  //   id: '5',
  //   thumbnail:
  //     'https://images.pexels.com/photos/33639142/pexels-photo-33639142.jpeg?auto=compress&cs=tinysrgb&w=800',
  //   channelAvatar: 'https://randomuser.me/api/portraits/men/31.jpg',
  //   title: 'Daily Prayers and Meditation Practices',
  //   channelName: 'Bhakti',
  //   views: '95k',
  //   timeAgo: '4 days ago',
  //   type: 'video',
  //   youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with actual YouTube URL
  // },
  // {
  //   id: '6',
  //   thumbnail:
  //     'https://images.pexels.com/photos/33639137/pexels-photo-33639137.jpeg?auto=compress&cs=tinysrgb&w=800',
  //   channelAvatar: 'https://randomuser.me/api/portraits/women/45.jpg',
  //   title: 'Community Service and Seva in Jainism',
  //   channelName: 'Spiritual Path',
  //   views: '67k',
  //   timeAgo: '6 days ago',
  //   type: 'video',
  //   youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with actual YouTube URL
  // },
];

export default function VideosReelsScreen() {
  const nav = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSelectedCategory('All');
    setTimeout(() => setRefreshing(false), 500);
  }, []);
  
  // Process videos to generate thumbnails from URLs if not provided
  const processedVideos = videosData.map(video => ({
    ...video,
    thumbnail: generateThumbnailFromUrl(video.youtubeUrl, video.thumbnail) || video.thumbnail,
  }));

  const openYouTubeVideo = (videoItem) => {
    if (!videoItem?.youtubeUrl) {
      Alert.alert('Error', 'Video URL not available');
      return;
    }

    // Navigate to YouTube player screen
    nav.navigate('YouTubePlayer', {video: videoItem});
  };

  const renderCategoryFilter = () => {
    return (
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}>
          {categories.map((category, index) => {
            const isActive = selectedCategory === category;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.filterButton,
                  isActive && styles.filterButtonActive,
                ]}>
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // Video Card Component with thumbnail error handling
  const VideoCard = React.memo(({item, onPress}) => {
    const thumbnailUrl = generateThumbnailFromUrl(item.youtubeUrl, item.thumbnail);
    const fallbackThumbnail = getFallbackThumbnail(item.youtubeUrl);
    const [imageError, setImageError] = useState(false);
    
    // Use fallback if main thumbnail fails
    const displayThumbnail = imageError && fallbackThumbnail ? fallbackThumbnail : thumbnailUrl;
    
    return (
      <Pressable
        onPress={() => onPress(item)}
        style={styles.videoCard}>
        {/* Video Thumbnail */}
        <View style={styles.thumbnailContainer}>
          {displayThumbnail ? (
            <Image 
              source={{uri: displayThumbnail}} 
              style={styles.thumbnail}
              onError={() => {
                // Try fallback thumbnail
                if (fallbackThumbnail && !imageError) {
                  setImageError(true);
                }
              }}
            />
          ) : (
            <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
              <Ionicons name="videocam-outline" size={40} color={COLORS.sub} />
            </View>
          )}
          {item.type === 'reel' && (
            <View style={styles.reelBadge}>
              <MaterialCommunityIcons name="film" size={14} color="#fff" />
              <Text style={styles.reelBadgeText}>Reel</Text>
            </View>
          )}
        </View>

        {/* Video Info */}
        <View style={styles.videoInfo}>
          {/* Channel Avatar */}
          <Image
            source={{uri: item.channelAvatar}}
            style={styles.channelAvatar}
          />

          {/* Title and Metadata */}
          <View style={styles.videoDetails}>
            <Text style={styles.videoTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.videoMetadata}>
              {item.channelName} • {item.views} views • {item.timeAgo}
            </Text>
          </View>

          {/* Options Menu */}
          <TouchableOpacity
            onPress={() => {
              // Show options menu
            }}
            style={styles.optionsButton}>
            <Ionicons name="ellipsis-vertical" size={18} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  });

  const renderVideoCard = ({item}) => {
    return <VideoCard item={item} onPress={openYouTubeVideo} />;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        
        {/* Top Bar Header */}
        <HeaderDashboard
          title="JainSansaar"
          LeftIcon={Menu}
          RightIcon1={Bell}
          RightIcon2={MessageCircle}
          leftNav="HomeDrawer"
          rightNav1="Notifications"
          rightNav2="Chat"
        />

        {/* Category Filters */}
        {renderCategoryFilter()}

        {/* Content List */}
        <FlatList
          data={processedVideos}
          keyExtractor={item => item.id.toString()}
          renderItem={renderVideoCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.orange]}
              tintColor={COLORS.orange}
            />
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  safeArea: {
    flex: 1,
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.filterInactive,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: COLORS.filterActive,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 100, // Extra padding for bottom tab bar
  },
  videoCard: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F2F2F2',
    marginBottom: 12,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reelBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reelBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  channelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  videoDetails: {
    flex: 1,
    marginRight: 8,
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  videoMetadata: {
    fontSize: 13,
    color: COLORS.sub,
    lineHeight: 18,
  },
  optionsButton: {
    padding: 4,
    marginTop: -4,
  },
});
