import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
} from 'react-native';
import {Heart, MessageCircle, Send, MoreHorizontal} from 'lucide-react-native';
import {colors} from '../../global/theme';
import CommentScreen from '../../screens/dashboard/comment';

const PostCard = ({
  userName = 'shivam',
  location = 'Unknown',
  image,
  likes = 0,
  comments = [],
  shares = 0,
  avatar,
  contentText = '',
}) => {
  const [visible, setVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleLike = () => {
    setIsLiked(prev => !prev);

    Animated.spring(scaleAnim, {
      toValue: 1.15,
      useNativeDriver: true,
      friction: 3,
      tension: 140,
    }).start(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 120,
      }).start();
    });
  };

  const likeCount = likes + (isLiked ? 1 : 0);
  const commentCount = comments?.length ?? 0;

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri:
                avatar ||
                'https://i.pravatar.cc/150?img=12', // fallback avatar
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName} numberOfLines={1}>
              {userName}
            </Text>
            <Text style={styles.location} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>

        <Pressable hitSlop={10}>
          <MoreHorizontal size={20} color="#222" />
        </Pressable>
      </View>

      {/* CAPTION */}
      {!!contentText && (
        <Text style={styles.caption} numberOfLines={2}>
          {contentText}
        </Text>
      )}

      {/* IMAGE */}
      {!!image && <Image source={{uri: image}} style={styles.postImage} />}

      {/* ACTIONS */}
      <View style={styles.actions}>
        {/* LIKE */}
        <Pressable style={styles.actionPill} onPress={handleLike}>
          <Animated.View style={{transform: [{scale: scaleAnim}]}}>
            <Heart
              size={18}
              color={colors.orange}
              fill={isLiked ? colors.orange : 'transparent'}
            />
          </Animated.View>
          <Text style={styles.actionText}>{likeCount}</Text>
        </Pressable>

        {/* COMMENT */}
        <Pressable style={styles.actionPill} onPress={() => setVisible(true)}>
          {/* Modal */}
          <CommentScreen
            visible={visible}
            setVisible={setVisible}
            comment={comments}
          />

          <MessageCircle size={18} color={colors.orange} />
          <Text style={styles.actionText}>{commentCount}</Text>
        </Pressable>

        {/* SHARE */}
        <Pressable style={styles.actionPill}>
          <Send size={18} color={colors.orange} />
          <Text style={styles.actionText}>{shares}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 16,
    marginVertical: 14,

    borderWidth: 1.5,
    borderColor: colors.orange,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,

    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    backgroundColor: '#eee',
  },

  userName: {
    fontWeight: '800',
    fontSize: 16,
    color: '#111',
    maxWidth: 220,
  },

  location: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    maxWidth: 220,
  },

  caption: {
    fontSize: 15,
    color: '#222',
    marginVertical: 10,
  },

  postImage: {
    width: '100%',
    aspectRatio: 1.15, // ✅ consistent across all screen sizes
    borderRadius: 22,
    backgroundColor: '#eee',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  actionPill: {
    flex: 1,
    marginHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#F6EFE7',
    paddingVertical: 12,
    borderRadius: 28,
    gap: 8,
  },

  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
});
