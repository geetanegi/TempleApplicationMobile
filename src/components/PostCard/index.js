import React, {useMemo, useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import {
  Heart,
  MessageCircle,
  Send,
  MoreVertical,
  Trash2,
  Archive,
  Clock3,
} from 'lucide-react-native';
import { colors } from '../../global/theme';
import Share from 'react-native-share';
import CommentScreen from '../../screens/dashboard/comment';
import {
  likePost,
  unlikePost,
  sharePost,
  unsharePost,
  follow,
  unfollow,
  isFollowing,
  getComments,
  commentOnPost,
} from '../../utils/apicalls/socialHandler';

const PostCard = ({
  userName = 'Camila',
  location = 'Mexico City, Mexico',
  timeText = '55m',
  image,
  likes = 5400,
  comments = [],
  shares = 100,
  avatar,
  contentText = '',
  shareUrl, // optional: pass actual url from parent
  onDelete, // optional callbacks
  onArchive,
  // Social API: when set, like/follow/comment call backend
  postId,
  authorUserId,
  currentUserId,
  onLikeChange, // (newLiked, newCount) after like/unlike
  onFollowChange, // (newFollowing) after follow/unfollow
  initialIsLiked = false,
  initialIsShared = false,
}) => {
  const {width: screenW, height: screenH} = useWindowDimensions();

  const [visible, setVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [commentList, setCommentList] = useState(Array.isArray(comments) ? comments : []);
  const [shareCount, setShareCount] = useState(shares);
  const [isShared, setIsShared] = useState(initialIsShared);
  const commentsFetched = useRef(false);
  const isFollowingFetched = useRef(false);
  const lastLikePressRef = useRef(0);

  const menuBtnRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({top: 0, left: 0});
  const [expanded, setExpanded] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const displayLikeCount = likeCount;
  const commentCount = typeof comments === 'number'
    ? (commentList.length > 0 ? commentList.length : comments)
    : (commentList?.length ?? (Array.isArray(comments) ? comments.length : 0));
  const displayShareCount = shareCount;

  const lastSyncedPostIdRef = useRef(null);

  // Sync from parent only when postId changes (different post). Stops initialIsLiked from overwriting user's unlike.
  React.useEffect(() => {
    if (lastSyncedPostIdRef.current !== postId) {
      lastSyncedPostIdRef.current = postId;
      setLikeCount(likes);
      setShareCount(shares);
      setIsLiked(!!initialIsLiked);
      setIsShared(!!initialIsShared);
    }
  }, [postId, likes, shares, initialIsLiked, initialIsShared]);

  // Fetch is-following state when we have author + current user
  React.useEffect(() => {
    if (authorUserId == null || currentUserId == null || authorUserId === currentUserId) return;
    if (isFollowingFetched.current) return;
    isFollowingFetched.current = true;
    isFollowing(currentUserId, authorUserId)
      .then(res => {
        const data = res?.data;
        setIsFollowingAuthor(!!data);
      })
      .catch(() => {});
  }, [authorUserId, currentUserId]);

  const handleFollow = useCallback(async () => {
    if (authorUserId == null || currentUserId == null || authorUserId === currentUserId || followLoading) return;
    setFollowLoading(true);
    try {
      if (isFollowingAuthor) {
        await unfollow(currentUserId, authorUserId);
        setIsFollowingAuthor(false);
        onFollowChange?.(false);
      } else {
        await follow(currentUserId, authorUserId);
        setIsFollowingAuthor(true);
        onFollowChange?.(true);
      }
    } catch (e) {
      console.warn('Follow API error:', e);
    } finally {
      setFollowLoading(false);
    }
  }, [authorUserId, currentUserId, isFollowingAuthor, followLoading, onFollowChange]);

  const normalizeComment = useCallback((c) => ({
    ...c,
    text: c.content != null ? c.content : c.text,
    user: typeof c.user === 'object' ? (c.user?.username || c.user?.name || 'User') : (c.user || 'User'),
    avatar: typeof c.user === 'object' ? c.user?.userProfile || c.user?.profileImageUrl : undefined,
  }));

  const openComments = useCallback(() => {
    if (postId != null && currentUserId != null && !commentsFetched.current) {
      commentsFetched.current = true;
      getComments(postId).then(res => {
        const data = res?.data;
        const list = Array.isArray(data) ? data.map(normalizeComment) : [];
        setCommentList(list);
      }).catch(() => {});
    } else if (!postId) {
      setCommentList(comments ?? []);
    }
    setVisible(true);
  }, [postId, currentUserId, comments, normalizeComment]);

  const handleSubmitComment = useCallback(async (content) => {
    if (!content?.trim() || postId == null || currentUserId == null) return;
    try {
      await commentOnPost(postId, currentUserId, content.trim());
      const res = await getComments(postId);
      const data = res?.data;
      const list = Array.isArray(data) ? data.map(normalizeComment) : [];
      setCommentList(list);
    } catch (e) {
      console.warn('Comment API error:', e);
    }
  }, [postId, currentUserId, normalizeComment]);

  const shortText = useMemo(() => {
    if (!contentText) return '';
    if (contentText.length <= 90) return contentText;
    return contentText.slice(0, 90).trim();
  }, [contentText]);

  const handleLike = useCallback(async () => {
    const now = Date.now();
    if (now - lastLikePressRef.current < 500) return;
    lastLikePressRef.current = now;

    const nextLiked = !isLiked;
    const prevLiked = isLiked;
    const prevCount = likeCount;

    // Optimistic update: change UI immediately
    setIsLiked(nextLiked);
    const newCount = nextLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    setLikeCount(newCount);
    onLikeChange?.(nextLiked, newCount);

    Animated.spring(scaleAnim, {
      toValue: 1.12,
      useNativeDriver: true,
      friction: 4,
      tension: 140,
    }).start(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 120,
      }).start();
    });

    if (postId != null && currentUserId != null) {
      try {
        if (nextLiked) await likePost(postId, currentUserId);
        else await unlikePost(postId, currentUserId);
      } catch (e) {
        const status = e?.status ?? e?.response?.status;
        const msg = e?.message ?? e?.response?.data?.message;
        console.warn('Like/Unlike API error:', { action: nextLiked ? 'like' : 'unlike', status, message: msg, fullError: e });
        // Revert on failure
        setIsLiked(prevLiked);
        setLikeCount(prevCount);
        onLikeChange?.(prevLiked, prevCount);
      }
    }
  }, [isLiked, postId, currentUserId, likeCount, onLikeChange, scaleAnim]);

  const ActionPill = ({icon, count}) => {
    return (
      <View style={styles.pill}>
        {icon}
        <Text style={styles.pillText}>{count}</Text>
      </View>
    );
  };

  const openMenuNextToButton = () => {
    // measure the 3-dots position and place menu near it
    menuBtnRef.current?.measureInWindow((x, y, w, h) => {
      const MENU_W = 150;
      const MENU_H = 110; // approx for 2 items
      const GAP = 8;

      // default: open below + align right edges
      let left = x + w - MENU_W;
      let top = y + h + GAP;

      // keep inside screen horizontally
      left = Math.max(12, Math.min(left, screenW - MENU_W - 12));

      // if going out of bottom, open above
      if (top + MENU_H > screenH - 12) {
        top = y - MENU_H - GAP;
      }

      setMenuPos({top, left});
      setMenuOpen(true);
    });
  };

  const handleShare = useCallback(async () => {
    const url = shareUrl || 'https://example.com';
    try {
      await Share.open({
        title: 'Share',
        message: contentText || 'Check this out',
        url,
      });
      if (postId != null && currentUserId != null && !isShared) {
        try {
          await sharePost(postId, currentUserId);
          setIsShared(true);
          setShareCount(c => c + 1);
        } catch (e) {
          console.warn('Share API error:', e);
        }
      }
    } catch (err) {
      if (err?.message !== 'User did not share') {
        console.log('Share error:', err);
      }
    }
  }, [shareUrl, contentText, postId, currentUserId, isShared]);

  return (
    <>
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{uri: avatar || 'https://i.pravatar.cc/150?img=12'}}
              style={styles.avatar}
            />

            <View style={{flex: 1}}>
              <Text style={styles.userName} numberOfLines={1}>
                {userName}
              </Text>
              <Text style={styles.location} numberOfLines={1}>
                {location}
              </Text>

              <View style={styles.timeRow}>
                <Text style={styles.timeText}>{timeText}</Text>
                <Clock3 size={12} color="#777" style={{marginLeft: 6}} />
              </View>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* Follow button */}
            {authorUserId != null && currentUserId != null && authorUserId !== currentUserId && (
              <Pressable onPress={handleFollow} disabled={followLoading}>
                <View
                  style={[
                    styles.followBtn,
                    {backgroundColor: isFollowingAuthor ? '#888' : colors.PRIMARY_BUTTON},
                  ]}>
                  {followLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.followText}>{isFollowingAuthor ? 'Following' : 'Follow'}</Text>
                  )}
                </View>
              </Pressable>
            )}

            {/* Menu button (3 dots) */}
            <Pressable ref={menuBtnRef} hitSlop={12} onPress={openMenuNextToButton}>
              <MoreVertical size={20} color="#111" />
            </Pressable>
          </View>
        </View>

        {/* MENU DROPDOWN */}
        <Modal
          transparent
          visible={menuOpen}
          animationType="fade"
          onRequestClose={() => setMenuOpen(false)}>
          <Pressable
            style={styles.menuBackdrop}
            onPress={() => setMenuOpen(false)}
          />

          <View style={[styles.menuBox, {top: menuPos.top, left: menuPos.left}]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                onDelete?.();
              }}>
              <Trash2 size={16} color="#666" />
              <Text style={styles.menuText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                onArchive?.();
              }}>
              <Archive size={16} color="#666" />
              <Text style={styles.menuText}>Archive</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* CAPTION */}
        {!!contentText && (
          <Text style={styles.caption}>
            {expanded ? contentText : shortText}
            {contentText.length > 90 && (
              <Text style={styles.seeMore} onPress={() => setExpanded(p => !p)}>
                {expanded ? '  See less' : '... See more'}
              </Text>
            )}
          </Text>
        )}

        {/* IMAGE CARD */}
        {!!image && (
          <View style={styles.imageWrap}>
            <Image source={{uri: image}} style={styles.postImage} />
          </View>
        )}

        {/* ACTIONS */}
        <View style={styles.actionsRow}>
          <View style={styles.actionCol}>
            <Pressable onPress={handleLike}>
              <ActionPill
                count={formatCount(displayLikeCount)}
                icon={
                  <Animated.View style={{transform: [{scale: scaleAnim}]}}>
                    <Heart
                      size={20}
                      color={isLiked ? '#ef4444' : colors.PRIMARY_DARK}
                      fill={isLiked ? '#ef4444' : 'transparent'}
                    />
                  </Animated.View>
                }
              />
            </Pressable>
          </View>

          <View style={styles.actionCol}>
            <Pressable onPress={openComments}>
              <ActionPill
                count={formatCount(commentCount)}
                icon={<MessageCircle size={20} color={colors.PRIMARY_DARK} />}
              />
            </Pressable>
          </View>

          <View style={styles.actionCol}>
            <Pressable onPress={handleShare}>
              <ActionPill
                count={formatCount(displayShareCount)}
                icon={<Send size={20} color={colors.PRIMARY_DARK} />}
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* COMMENTS */}
      <CommentScreen
        visible={visible}
        setVisible={setVisible}
        comment={commentList}
        onSendComment={postId != null && currentUserId != null ? handleSubmitComment : undefined}
      />
    </>
  );
};

export default PostCard;

// ---------- helpers ----------
function formatCount(n) {
  const num = Number(n || 0);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}m`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 26,
    padding: 16,
    marginVertical: 12,

    // Box shadow in all directions (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    // Android
    elevation: 8,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 999,
    marginRight: 12,
    backgroundColor: '#eee',
  },

  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
  },

  location: {
    fontSize: 13,
    color: '#7B7B7B',
    marginTop: 2,
    fontWeight: '600',
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  timeText: {
    fontSize: 12,
    color: '#111',
    fontWeight: '700',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  followBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },

  followText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },

  caption: {
    marginTop: 10,
    fontSize: 14,
    color: '#111',
    lineHeight: 20,
    fontWeight: '500',
  },

  seeMore: {
    color: '#666',
    fontWeight: '700',
  },

  imageWrap: {
    marginTop: 14,
    borderRadius: 28,
    overflow: 'hidden',
  },

  postImage: {
    width: '100%',
    height: 340,
    backgroundColor: '#eee',
  },

  actionsRow: {
    flexDirection: 'row',
    marginTop: 16,
    paddingHorizontal: 6,
    alignItems: 'center',
  },

  actionCol: {
    marginRight: 12,
  },

  pill: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  pillText: {
    // color: '#fff',
    color: colors.PRIMARY_DARK,
    fontSize: 16,
    fontWeight: '900',
  },

  // menu
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  menuBox: {
    position: 'absolute',
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 6,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 6},
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '700',
  },
});
