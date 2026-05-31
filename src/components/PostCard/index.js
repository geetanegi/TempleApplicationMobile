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
  Platform,
  Alert,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {
  Heart,
  MessageCircle,
  Send,
  MoreVertical,
  Trash2,
  Clock3,
  Play,
  User,
} from 'lucide-react-native';
import Video from 'react-native-video';
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
  replyToComment,
  deleteComment,
  getFollowing,
  createOrGetChatThread,
  sendChatMessage,
} from '../../utils/apicalls/socialHandler';
import { resolveProfilePictureUrl, getProfilePictureUrlByUserId } from '../../utils/apicalls/profileHandler';
import { formatDateTimeIST } from '../../utils/helperfunctions/dateTimeUtils';
import ShareToChatSheet from '../ShareToChatSheet';

const PostCard = ({
  userName = 'Camila',
  createdAt,
  timeText,
  image,
  videoUrl,
  thumbnailUrl,
  likes = 5400,
  comments = [],
  shares = 100,
  avatar,
  contentText = '',
  shareUrl, // optional: pass actual url from parent
  onDelete, // optional callbacks
  // Social API: when set, like/follow/comment call backend
  postId,
  authorUserId,
  currentUserId,
  onLikeChange, // (newLiked, newCount) after like/unlike
  onFollowChange, // (newFollowing) after follow/unfollow
  initialIsLiked = false,
  initialIsShared = false,
  onAuthorPress, // (authorUserId) when user taps author name to open profile
  onImagePress, // when user taps photo/video to open full post view (e.g. PostPreview)
  // Stable-callback form: pass (postId, ...) so parent can use useCallback without item in closure
  onLikeChangeWithPostId, // (postId, newLiked, newCount)
  onDeleteWithPostId, // (postId)
  onImagePressWithPostId, // (postId)
  expandMedia = false, // when true (e.g. PostPreviewScreen), show media much larger
  instagramStyle = false, // dashboard feed style without card container
}) => {
  const {width: screenW, height: screenH} = useWindowDimensions();
  const defaultMediaHeight = instagramStyle ? Math.round(screenW * 1.25) : 340;
  const mediaHeight = expandMedia ? Math.min(Math.round(screenH * 0.6), 520) : defaultMediaHeight;
  const mediaResizeMode = instagramStyle ? 'cover' : 'contain';

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
  const [shareSheetVisible, setShareSheetVisible] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [shareQuery, setShareQuery] = useState('');
  const [sendingToUserId, setSendingToUserId] = useState(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [freezeVideoLayout, setFreezeVideoLayout] = useState(false);

  const inNativeFullscreenRef = useRef(false);
  const nativeFullscreenLockTimerRef = useRef(null);
  const lastVideoBoxLayoutRef = useRef({ w: 0, h: 0 });
  const frozenMetricsRef = useRef({ w: 0, h: 0 });

  const clearFullscreenPortraitTimer = useCallback(() => {
    if (nativeFullscreenLockTimerRef.current) {
      clearTimeout(nativeFullscreenLockTimerRef.current);
      nativeFullscreenLockTimerRef.current = null;
    }
  }, []);

  /** Must mirror latest videoPlaying for unmount cleanup (refs see last committed render). */
  const videoPlayingRef = useRef(false);
  videoPlayingRef.current = videoPlaying;

  /**
   * Never call lockToPortrait from mount or from unrelated PostCards. FlatList recycles cells on
   * rotation/layout; off-screen cards unmounting/mounting was forcing portrait while another post
   * stayed in native fullscreen landscape.
   */
  React.useEffect(() => {
    return () => {
      clearFullscreenPortraitTimer();
      if (
        videoPlayingRef.current &&
        (Platform.OS === 'ios' || Platform.OS === 'android')
      ) {
        Orientation.lockToPortrait();
      }
    };
  }, [clearFullscreenPortraitTimer]);

  const prevVideoPlayingRef = useRef(false);
  React.useEffect(() => {
    if (!videoPlaying) {
      clearFullscreenPortraitTimer();
      inNativeFullscreenRef.current = false;
      setFreezeVideoLayout(false);
      if (
        prevVideoPlayingRef.current &&
        (Platform.OS === 'ios' || Platform.OS === 'android')
      ) {
        Orientation.lockToPortrait();
      }
    }
    prevVideoPlayingRef.current = videoPlaying;
  }, [videoPlaying, clearFullscreenPortraitTimer]);

  const onVideoFullscreenWillPresent = useCallback(() => {
    const w = lastVideoBoxLayoutRef.current.w || screenW;
    frozenMetricsRef.current = { w, h: mediaHeight };
    inNativeFullscreenRef.current = true;
    clearFullscreenPortraitTimer();
    setFreezeVideoLayout(true);
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Orientation.unlockAllOrientations();
    }
  }, [clearFullscreenPortraitTimer, mediaHeight, screenW]);

  const onVideoFullscreenDidPresent = useCallback(() => {
    inNativeFullscreenRef.current = true;
    clearFullscreenPortraitTimer();
  }, [clearFullscreenPortraitTimer]);

  /** Native stack sometimes emits dismiss during rotation; debounce lock + unfreeze. */
  const onVideoFullscreenDidDismiss = useCallback(() => {
    inNativeFullscreenRef.current = false;
    clearFullscreenPortraitTimer();
    nativeFullscreenLockTimerRef.current = setTimeout(() => {
      nativeFullscreenLockTimerRef.current = null;
      if (!inNativeFullscreenRef.current && (Platform.OS === 'ios' || Platform.OS === 'android')) {
        Orientation.lockToPortrait();
      }
      setFreezeVideoLayout(false);
    }, 650);
  }, [clearFullscreenPortraitTimer]);

  const onVideoBoxLayout = useCallback(
    (e) => {
      if (freezeVideoLayout) return;
      const { width, height } = e.nativeEvent.layout;
      lastVideoBoxLayoutRef.current = { w: width, h: height };
    },
    [freezeVideoLayout],
  );

  const displayTimeAgo = createdAt != null ? formatDateTimeIST(createdAt) : (timeText || '');
  const displayLikeCount = likeCount;
  const commentCount = typeof comments === 'number'
    ? (commentList.length > 0 ? commentList.length : comments)
    : (commentList?.length ?? (Array.isArray(comments) ? comments.length : 0));

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

  const normalizeComment = useCallback((c) => {
    const userObj = typeof c.user === 'object' ? c.user : null;
    const profile = userObj?.userProfile;
    const avatarUrl =
      userObj?.avatarUrl ||
      (typeof profile === 'string' ? profile : null) ||
      profile?.imageUrl ||
      profile?.directImageUrl ||
      (typeof userObj?.profileImageUrl === 'string' ? userObj.profileImageUrl : null);
    const displayName = userObj
      ? (userObj.name || userObj.username || [userObj.firstName, userObj.lastName].filter(Boolean).join(' ') || 'User')
      : (c.user || 'User');
    const resolvedAvatar = resolveProfilePictureUrl(avatarUrl) || getProfilePictureUrlByUserId(userObj?.id);
    return {
      ...c,
      id: c.id,
      parentCommentId: c.parentCommentId ?? null,
      text: c.content != null ? c.content : c.text,
      user: displayName,
      userId: userObj?.id,
      avatar: resolvedAvatar || undefined,
    };
  });

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

  const extractNewCommentId = (postRes) => {
    const inner = postRes?.data;
    if (inner && typeof inner === 'object' && inner.id != null) return inner.id;
    if (postRes?.id != null) return postRes.id;
    return null;
  };

  const handleSubmitComment = useCallback(async (content) => {
    if (!content?.trim() || postId == null || currentUserId == null) return undefined;
    try {
      const postRes = await commentOnPost(postId, currentUserId, content.trim());
      const res = await getComments(postId);
      const data = res?.data;
      const list = Array.isArray(data) ? data.map(normalizeComment) : [];
      setCommentList(list);
      const nid = extractNewCommentId(postRes);
      return nid != null ? nid : 'end';
    } catch (e) {
      console.warn('Comment API error:', e);
      return undefined;
    }
  }, [postId, currentUserId, normalizeComment]);

  const handleSubmitReply = useCallback(async (parentCommentId, content) => {
    if (!content?.trim() || postId == null || currentUserId == null || !parentCommentId) return undefined;
    try {
      const postRes = await replyToComment(postId, currentUserId, parentCommentId, content.trim());
      const res = await getComments(postId);
      const data = res?.data;
      const list = Array.isArray(data) ? data.map(normalizeComment) : [];
      setCommentList(list);
      const nid = extractNewCommentId(postRes);
      return nid != null ? nid : 'end';
    } catch (e) {
      console.warn('Reply API error:', e);
      return undefined;
    }
  }, [postId, currentUserId, normalizeComment]);

  const handleDeleteComment = useCallback(async (commentId) => {
    if (postId == null || currentUserId == null) return;
    try {
      await deleteComment(postId, commentId, currentUserId);
      const res = await getComments(postId);
      const data = res?.data;
      const list = Array.isArray(data) ? data.map(normalizeComment) : [];
      setCommentList(list);
    } catch (e) {
      console.warn('Delete comment API error:', e);
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
    if (onLikeChangeWithPostId && postId != null) {
      onLikeChangeWithPostId(postId, nextLiked, newCount);
    } else {
      onLikeChange?.(nextLiked, newCount);
    }

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
        if (onLikeChangeWithPostId && postId != null) {
          onLikeChangeWithPostId(postId, prevLiked, prevCount);
        } else {
          onLikeChange?.(prevLiked, prevCount);
        }
      }
    }
  }, [isLiked, postId, currentUserId, likeCount, onLikeChange, onLikeChangeWithPostId, scaleAnim]);

  const ActionPill = ({icon, count}) => {
    return (
      <View style={styles.pill}>
        {icon}
        {count != null ? <Text style={styles.pillText}>{count}</Text> : null}
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

  const createClientMessageId = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  const buildPostShareMessage = useCallback(() => {
    const caption = (contentText || '').trim();
    const postDeepLink =
      postId != null
        ? `https://jainsansaar.app/post/${postId}`
        : shareUrl || '';
    return [caption ? `Check out this post: ${caption}` : 'Check out this post!', postDeepLink]
      .filter(Boolean)
      .join('\n');
  }, [contentText, postId, shareUrl]);

  const markPostShared = useCallback(async () => {
    if (postId == null || currentUserId == null || isShared) return;
    try {
      await sharePost(postId, currentUserId);
      setIsShared(true);
      setShareCount(c => c + 1);
    } catch (e) {
      console.warn('Share API error:', e);
    }
  }, [postId, currentUserId, isShared]);

  const handleShare = useCallback(async () => {
    if (!currentUserId || postId == null) return;
    setShareSheetVisible(true);
    setShareQuery('');
    setLoadingFollowing(true);
    try {
      const res = await getFollowing(currentUserId);
      setFollowingUsers(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setFollowingUsers([]);
    } finally {
      setLoadingFollowing(false);
    }
  }, [currentUserId, postId]);

  const handleSendPostToUser = useCallback(
    async (user) => {
      if (!currentUserId || postId == null) return;
      const otherUserId = user?.id ?? user?.userId;
      if (!otherUserId) return;

      setSendingToUserId(otherUserId);
      try {
        const threadRes = await createOrGetChatThread(currentUserId, otherUserId);
        const threadId = threadRes?.data?.id;
        if (!threadId) throw new Error('Chat thread not found');
        await sendChatMessage(
          threadId,
          currentUserId,
          createClientMessageId(),
          buildPostShareMessage(),
          'text',
        );
        await markPostShared();
        setShareSheetVisible(false);
      } catch (e) {
        Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to send post');
      } finally {
        setSendingToUserId(null);
      }
    },
    [currentUserId, postId, buildPostShareMessage, markPostShared],
  );

  const handleMoreOptionsShare = useCallback(async () => {
    const deepLinkUrl =
      postId != null ? `https://jainsansaar.app/post/${postId}` : shareUrl || '';
    try {
      await Share.open({
        title: 'Share Post',
        message: buildPostShareMessage(),
        url: deepLinkUrl || undefined,
      });
      await markPostShared();
      setShareSheetVisible(false);
    } catch (err) {
      if (err?.message !== 'User did not share') {
        console.log('Share error:', err);
      }
    }
  }, [postId, shareUrl, buildPostShareMessage, markPostShared]);

  return (
    <>
      <View style={[styles.card, instagramStyle && styles.cardInstagram]}>
        {/* Content above actions: light grey */}
        <View style={[styles.cardContentAboveActions, instagramStyle && styles.cardContentInstagram]}>
        {/* HEADER */}
        <View style={[styles.header, instagramStyle && styles.headerInstagram]}>
          <View style={[styles.userInfo, instagramStyle && styles.userInfoInstagram]}>
            {(resolveProfilePictureUrl(avatar) || avatar) ? (
              <Image
                key={resolveProfilePictureUrl(avatar) || avatar}
                source={{
                  uri: resolveProfilePictureUrl(avatar) || avatar,
                  ...(authorUserId === currentUserId && { cache: 'reload' }),
                }}
                style={[styles.avatar, instagramStyle && styles.avatarInstagram]}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarIconWrap, instagramStyle && styles.avatarInstagram]}>
                <User size={24} color="#777" strokeWidth={2} />
              </View>
            )}

            <View style={{flex: 1}}>
              <Pressable
                onPress={() => authorUserId != null && onAuthorPress?.(authorUserId)}
                style={({pressed}) => ({ opacity: pressed && authorUserId ? 0.7 : 1 })}
              >
                <Text style={[styles.userName, instagramStyle && styles.userNameInstagram]} numberOfLines={1}>
                  {userName}
                </Text>
              </Pressable>
              {displayTimeAgo ? (
                <View style={[styles.timeRow, instagramStyle && styles.timeRowInstagram]}>
                  <Clock3 size={12} color="#777" style={{marginRight: 4}} />
                  <Text style={[styles.timeText, instagramStyle && styles.timeTextInstagram]}>{displayTimeAgo}</Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={[styles.headerRight, instagramStyle && styles.headerRightInstagram]}>
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

            {/* Menu (3 dots) - only for current user's post */}
            {authorUserId != null && currentUserId != null && authorUserId === currentUserId && (
              <Pressable ref={menuBtnRef} hitSlop={12} onPress={openMenuNextToButton}>
                <MoreVertical size={20} color="#111" />
              </Pressable>
            )}
          </View>
        </View>

        {/* MENU DROPDOWN - only shown for own post */}
        {authorUserId != null && currentUserId != null && authorUserId === currentUserId && (
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
                  if (onDeleteWithPostId && postId != null) onDeleteWithPostId(postId);
                  else onDelete?.();
                }}>
                <Trash2 size={16} color="#666" />
                <Text style={styles.menuText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}

        {/* CAPTION */}
        {!instagramStyle && !!contentText && (
          <Text style={styles.caption}>
            {expanded ? contentText : shortText}
            {contentText.length > 90 && (
              <Text style={styles.seeMore} onPress={() => setExpanded(p => !p)}>
                {expanded ? '  See less' : '... See more'}
              </Text>
            )}
          </Text>
        )}

        {/* MEDIA: image or video (thumbnail + play overlay; tap plays inline) */}
        {!!videoUrl && (
          <View style={[styles.imageWrap, instagramStyle && styles.imageWrapInstagram]}>
            {videoPlaying ? (
              <View
                onLayout={onVideoBoxLayout}
                style={[
                  styles.videoContainer,
                  freezeVideoLayout
                    ? {
                        width: frozenMetricsRef.current.w,
                        height: frozenMetricsRef.current.h,
                        alignSelf: 'center',
                      }
                    : { width: '100%', height: mediaHeight },
                ]}
              >
                <Video
                  source={{ uri: String(videoUrl || '') }}
                  style={[
                    styles.postImage,
                    {
                      height: freezeVideoLayout ? frozenMetricsRef.current.h : mediaHeight,
                    },
                  ]}
                  controls
                  resizeMode={mediaResizeMode}
                  paused={false}
                  fullscreenAutorotate
                  fullscreenOrientation="all"
                  onFullscreenPlayerWillPresent={onVideoFullscreenWillPresent}
                  onFullscreenPlayerDidPresent={onVideoFullscreenDidPresent}
                  onFullscreenPlayerDidDismiss={onVideoFullscreenDidDismiss}
                  onEnd={() => setVideoPlaying(false)}
                  onError={(e) => {
                    if (__DEV__) console.warn('PostCard video error', e);
                    setVideoPlaying(false);
                  }}
                />
                <Pressable
                  style={styles.videoCloseOverlay}
                  onPress={() => setVideoPlaying(false)}
                >
                  <Text style={styles.videoCloseText}>✕</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={[styles.videoThumbWrap, { height: mediaHeight }]}
                onPress={() => {
                if (postId != null && (onImagePressWithPostId || onImagePress)) {
                  onImagePressWithPostId?.(postId) ?? onImagePress?.();
                } else {
                  setVideoPlaying(true);
                }
              }}
              >
                <Image
                  source={{ uri: thumbnailUrl || videoUrl }}
                  style={[styles.postImage, { height: mediaHeight }]}
                  resizeMode={mediaResizeMode}
                />
                <View style={styles.videoPlayOverlay}>
                  <View style={styles.videoPlayCircle}>
                    <Play size={48} color="#fff" fill="#fff" />
                  </View>
                </View>
              </Pressable>
            )}
          </View>
        )}
        {!videoUrl && !!image && (
          <View style={[styles.imageWrap, instagramStyle && styles.imageWrapInstagram]}>
            <Pressable
              onPress={() => {
              if (postId != null) {
                onImagePressWithPostId?.(postId) ?? onImagePress?.();
              }
            }}
              style={styles.imagePressable}
            >
              <Image
                source={{uri: image}}
                style={[
                  styles.postImage,
                  { height: mediaHeight },
                ]}
                resizeMode={mediaResizeMode}
              />
            </Pressable>
          </View>
        )}

        {/* CAPTION (Instagram-style: below media) */}
        {instagramStyle && !!contentText && (
          <Text style={styles.caption}>
            {expanded ? contentText : shortText}
            {contentText.length > 90 && (
              <Text style={styles.seeMore} onPress={() => setExpanded(p => !p)}>
                {expanded ? '  See less' : '... See more'}
              </Text>
            )}
          </Text>
        )}
        </View>

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
        onSendReply={postId != null && currentUserId != null ? handleSubmitReply : undefined}
        onDeleteComment={postId != null && currentUserId != null ? handleDeleteComment : undefined}
        currentUserId={currentUserId}
      />

      <ShareToChatSheet
        visible={shareSheetVisible}
        onClose={() => setShareSheetVisible(false)}
        followingUsers={followingUsers}
        loadingFollowing={loadingFollowing}
        shareQuery={shareQuery}
        onShareQueryChange={setShareQuery}
        sendingToUserId={sendingToUserId}
        onSendToUser={handleSendPostToUser}
        onMoreOptions={handleMoreOptionsShare}
        title="Share post"
      />
    </>
  );
};

export default React.memo(PostCard);

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
  cardInstagram: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    marginVertical: 10,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },

  cardContentAboveActions: {
    backgroundColor: '#f2f2f2',
    marginHorizontal: -16,
    marginTop: -16,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 2,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  cardContentInstagram: {
    backgroundColor: 'transparent',
    marginHorizontal: 0,
    marginTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInstagram: {
    minHeight: 44,
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  userInfoInstagram: {
    paddingRight: 6,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 999,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  avatarInstagram: {
    width: 36,
    height: 36,
    marginRight: 9,
  },

  avatarIconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
  },
  userNameInstagram: {
    fontSize: 16,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  timeRowInstagram: {
    marginTop: 3,
  },

  timeText: {
    fontSize: 11,
    color: '#111',
    fontWeight: '700',
  },
  timeTextInstagram: {
    fontSize: 11,
    fontWeight: '600',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerRightInstagram: {
    gap: 6,
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
    marginHorizontal: -16,
    overflow: 'hidden',
  },
  imageWrapInstagram: {
    marginHorizontal: -16,
  },

  imagePressable: {
    width: '100%',
  },

  postImage: {
    width: '100%',
    height: 340,
    backgroundColor: '#1a1a1a',
  },

  videoThumbWrap: {
    position: 'relative',
    width: '100%',
    height: 340,
    backgroundColor: '#1a1a1a',
  },
  videoPlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  videoPlayCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: 340,
  },
  videoCloseOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  videoCloseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  actionsRow: {
    flexDirection: 'row',
    marginTop: 8,
    paddingHorizontal: 0,
    alignItems: 'center',
  },

  actionCol: {
    width: 52,
    marginRight: 0,
    alignItems: 'center',
  },

  pill: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
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
