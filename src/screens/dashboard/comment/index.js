import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  TextInput,
  Modal,
  Animated,
  Dimensions,
  Alert,
  Keyboard,
  Platform,
  InteractionManager,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getProfilePictureUrlByUserId, resolveProfilePictureUrl } from '../../../utils/apicalls/profileHandler';

const {height: SCREEN_H} = Dimensions.get('window');

const AVATAR = 'https://i.pravatar.cc/150?img=3';

function parseDate(value) {
  if (value == null) return null;
  if (typeof value === 'number') return new Date(value);
  if (Array.isArray(value)) {
    const [y, m, d, h = 0, min = 0, s = 0] = value;
    return new Date(Date.UTC(y, m - 1, d, h, min, s));
  }
  if (typeof value === 'string') {
    if (!/[Zz]$/.test(value) && !/[+-]\d{2}:\d{2}$/.test(value)) {
      return new Date(value + 'Z');
    }
    return new Date(value);
  }
  return new Date(value);
}

function formatRelativeTime(value) {
  const d = parseDate(value);
  if (!d || isNaN(d.getTime())) return '';
  const diffMs = Date.now() - d.getTime();
  if (diffMs < 0) return 'now';
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(diffMs / 3600000);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(diffMs / 86400000);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
}

/** Current user avatar URI – same pattern as FollowListScreen (profile picture by userId). */
function getMyAvatarUri(userId) {
  if (userId == null) return AVATAR;
  const url = getProfilePictureUrlByUserId(userId);
  const resolved = resolveProfilePictureUrl(url || '');
  if (resolved && (resolved.startsWith('http://') || resolved.startsWith('https://'))) {
    return resolved;
  }
  return AVATAR;
}

const SHEET_HEIGHT = Math.round(SCREEN_H * 0.78); // tweak 0.72 - 0.85

/** Space under list so last comments can scroll above the floating input dock */
const LIST_BOTTOM_PADDING_FOR_INPUT = 108;

const DRAG_CLOSE_THRESHOLD = 70;
const VELOCITY_CLOSE_THRESHOLD = 350;
const SCROLL_AT_TOP_THRESHOLD = 10;

/** Flatten nested replies into a single array (API may return comment.replies = []). */
function flattenComments(input) {
  if (!Array.isArray(input) || input.length === 0) return [];
  const out = [];
  input.forEach((c) => {
    const { replies, ...rest } = c;
    out.push(rest);
    if (Array.isArray(replies) && replies.length > 0) {
      replies.forEach((r) => out.push({ ...r, parentCommentId: r.parentCommentId ?? c.id }));
    }
  });
  return out;
}

/** Build flat list: top-level comments first, then their replies in order. No tree UI. */
function buildCommentListWithReplies(flatList) {
  const list = flattenComments(flatList ?? []);
  if (list.length === 0) return [];
  const topLevel = list.filter((c) => !c.parentCommentId);
  const byParent = new Map();
  list.forEach((c) => {
    if (c.parentCommentId != null) {
      const arr = byParent.get(c.parentCommentId) || [];
      arr.push(c);
      byParent.set(c.parentCommentId, arr);
    }
  });
  const result = [];
  topLevel.forEach((parent) => {
    result.push({ ...parent, isReply: false });
    (byParent.get(parent.id) || []).forEach((r) => result.push({ ...r, isReply: true }));
  });
  return result;
}

const CommentScreen = ({
  visible,
  setVisible,
  comment,
  onSendComment,
  onSendReply,
  onDeleteComment,
  currentUserId,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const data = useMemo(() => buildCommentListWithReplies(comment ?? []), [comment]);

  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const scrollAtTop = useRef(true);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  /** After post: comment id, 'end', or null — scroll once list has measured (scrollToEnd is unreliable before content size is known). */
  const scrollAfterPostRef = useRef(null);
  const postedScrollFallbackTimerRef = useRef(null);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const runCloseAnimation = useRef(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SHEET_HEIGHT,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(dragY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  }).current;

  const runSnapBack = useRef(() => {
    Animated.spring(dragY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 22,
      stiffness: 320,
    }).start();
  }).current;

  const panGesture = useRef(
    Gesture.Pan()
      .activeOffsetY(8)
      .failOffsetY(-15)
      .onUpdate((e) => {
        if (scrollAtTop.current && e.translationY > 0) {
          dragY.setValue(e.translationY);
        }
      })
      .onEnd((e) => {
        const {translationY, velocityY} = e;
        const shouldClose =
          translationY > DRAG_CLOSE_THRESHOLD || velocityY > VELOCITY_CLOSE_THRESHOLD;
        if (shouldClose) {
          runCloseAnimation();
        } else {
          runSnapBack();
        }
      }),
  ).current;

  useEffect(() => {
    if (!visible) {
      setReplyingTo(null);
      setKeyboardHeight(0);
      scrollAfterPostRef.current = null;
      if (postedScrollFallbackTimerRef.current != null) {
        clearTimeout(postedScrollFallbackTimerRef.current);
        postedScrollFallbackTimerRef.current = null;
      }
    }
  }, [visible]);

  const scrollListToPosted = useCallback((target, list) => {
    if (!flatListRef.current) return;
    if (target === 'end') {
      flatListRef.current.scrollToEnd({animated: true});
      return;
    }
    const idx = list.findIndex((c) => String(c?.id) === String(target));
    if (idx >= 0) {
      try {
        flatListRef.current.scrollToIndex({
          index: idx,
          animated: true,
          viewPosition: 0.35,
        });
      } catch {
        flatListRef.current.scrollToEnd({animated: true});
      }
    } else {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, []);

  const runPostedScrollIfPending = useCallback(() => {
    const target = scrollAfterPostRef.current;
    if (target == null || !visible || !flatListRef.current) return;
    scrollAfterPostRef.current = null;
    const list = data;
    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollListToPosted(target, list);
        });
      });
    });
  }, [data, visible, scrollListToPosted]);

  /** Fallback if onContentSizeChange did not run (e.g. rare same-height edge cases). */
  useLayoutEffect(() => {
    const target = scrollAfterPostRef.current;
    if (target == null || !visible) return;
    if (postedScrollFallbackTimerRef.current != null) {
      clearTimeout(postedScrollFallbackTimerRef.current);
    }
    postedScrollFallbackTimerRef.current = setTimeout(() => {
      postedScrollFallbackTimerRef.current = null;
      if (scrollAfterPostRef.current != null) {
        runPostedScrollIfPending();
      }
    }, 400);
    return () => {
      if (postedScrollFallbackTimerRef.current != null) {
        clearTimeout(postedScrollFallbackTimerRef.current);
        postedScrollFallbackTimerRef.current = null;
      }
    };
  }, [data, visible, runPostedScrollIfPending]);

  useEffect(() => {
    if (visible) {
      dragY.setValue(0);
      scrollAtTop.current = true;
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SHEET_HEIGHT,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, backdropOpacity, translateY]);

  const close = () => {
    runCloseAnimation();
  };

  const cancelReply = () => setReplyingTo(null);

  const onSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    try {
      let scrollTarget = null;
      if (replyingTo != null && typeof onSendReply === 'function') {
        scrollTarget = await onSendReply(replyingTo.id, trimmed);
        setReplyingTo(null);
      } else if (typeof onSendComment === 'function') {
        scrollTarget = await onSendComment(trimmed);
      }
      setInput('');
      inputRef.current?.blur?.();
      Keyboard.dismiss();
      if (scrollTarget != null) {
        scrollAfterPostRef.current = scrollTarget;
      }
    } catch (e) {
      // Parent may rethrow; keep draft text
    }
  };

  const openCommenterProfile = (item) => {
    const uid =
      typeof item?.user === 'object' && item?.user?.id != null
        ? item.user.id
        : item?.userId;
    if (uid == null) return;
    Keyboard.dismiss();
    if (typeof setVisible === 'function') {
      setVisible(false);
    }
    requestAnimationFrame(() => {
      navigation.navigate('Profiles', {userId: uid});
    });
  };

  const getAvatarUri = (item) => {
    const v = item?.avatar;
    if (typeof v === 'string' && v.trim()) return resolveProfilePictureUrl(v) || v;
    if (v && typeof v === 'object' && typeof v.imageUrl === 'string') return resolveProfilePictureUrl(v.imageUrl) || v.imageUrl;
    const userAvatar = item?.user?.avatarUrl;
    if (typeof userAvatar === 'string' && userAvatar.trim()) return resolveProfilePictureUrl(userAvatar) || userAvatar;
    return getProfilePictureUrlByUserId(item?.user?.id ?? item?.userId) || AVATAR;
  };

  const handleDeletePress = (item) => {
    if (typeof onDeleteComment !== 'function') return;
    Alert.alert(
      'Delete comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteComment(item.id),
        },
      ],
    );
  };

  const renderItem = ({item}) => {
    const isReply = item.isReply === true;
    const avatarUri = getAvatarUri(item);
    const userDisplay = typeof item?.user === 'string'
      ? (item.user || 'User')
      : (item?.user?.name || item?.user?.username || 'User');
    const canDelete = typeof onDeleteComment === 'function' && currentUserId != null && String(item?.user?.id ?? item?.userId) === String(currentUserId);
    const profileUserId =
      typeof item?.user === 'object' && item?.user?.id != null
        ? item.user.id
        : item?.userId;
    const canOpenProfile = profileUserId != null;

    return (
      <View style={[styles.row, isReply && styles.replyRow]}>
        <Pressable
          onPress={() => canOpenProfile && openCommenterProfile(item)}
          disabled={!canOpenProfile}
          hitSlop={4}
        >
          <Image
            style={styles.avatar}
            source={{ uri: avatarUri }}
            resizeMode="cover"
          />
        </Pressable>

        <View style={styles.textBlock}>
          <View style={styles.titleRow}>
            <Pressable
              onPress={() => canOpenProfile && openCommenterProfile(item)}
              disabled={!canOpenProfile}
              hitSlop={4}
            >
              <Text style={styles.nameText}>{userDisplay}</Text>
            </Pressable>
            {!!(item?.commentedAt) && (
              <Text style={styles.timeText}>  •  {formatRelativeTime(item.commentedAt)}</Text>
            )}
            {canDelete && (
              <Pressable
                hitSlop={10}
                style={styles.deleteIconWrap}
                onPress={() => handleDeletePress(item)}
              >
                <FontAwesome name="trash-o" size={16} color="#8E8E8E" />
              </Pressable>
            )}
          </View>

          <Text style={styles.bodyText}>{item?.content ?? item?.text ?? ''}</Text>

          {!isReply && (
            <Pressable
              hitSlop={10}
              style={styles.replyBtn}
              onPress={() => setReplyingTo({ id: item.id, user: userDisplay })}
            >
              <Text style={styles.replyText}>Reply</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  const inputDockPadBottom = keyboardHeight > 0 ? 10 : 10 + insets.bottom;

  const renderFloatingInputDock = () => (
    <View
      style={[
        styles.floatingInputDock,
        { bottom: keyboardHeight, paddingBottom: inputDockPadBottom },
      ]}
    >
      <View style={styles.inputDock}>
        <Image style={styles.meAvatar} source={{ uri: getMyAvatarUri(currentUserId) }} />
        <View style={styles.inputWrap}>
          {replyingTo != null && (
            <View style={styles.replyingToRow}>
              <Text style={styles.replyingToText} numberOfLines={1}>
                Replying to @{replyingTo.user}
              </Text>
              <Pressable hitSlop={8} onPress={cancelReply}>
                <Text style={styles.cancelReplyText}>Cancel</Text>
              </Pressable>
            </View>
          )}
          <View style={styles.inputPill}>
            <TextInput
              ref={inputRef}
              value={input}
              onChangeText={setInput}
              placeholder={replyingTo ? 'Write a reply...' : 'Add a comment'}
              placeholderTextColor="#8E8E8E"
              style={styles.input}
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={onSend}
            />
            <Pressable onPress={onSend} hitSlop={10} style={styles.actionBtn}>
              <FontAwesome name="send" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );

  const listBottomPad =
    LIST_BOTTOM_PADDING_FOR_INPUT + (replyingTo != null ? 40 : 0);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={close}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* Backdrop */}
        <Pressable style={StyleSheet.absoluteFill} onPress={close}>
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </Pressable>

        {/* Bottom Sheet - whole sheet swipeable down to close */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[styles.sheetWrap, { transform: [{ translateY: Animated.add(translateY, dragY) }] }]}>
            <LinearGradient
              colors={['#E9D3A3', '#F6F2E6', '#F6F2E6']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.sheet}>
              <View style={styles.dragArea} collapsable={false}>
                <View style={styles.handleWrap}>
                  <View style={styles.handle} />
                </View>
                <Text style={styles.headerTitle}>Comments</Text>
              </View>

              <FlatList
                ref={flatListRef}
                data={data}
                keyExtractor={(item, index) => `comment-${item?.id ?? item?.parentCommentId ?? index}-${index}`}
                renderItem={renderItem}
                style={styles.flex}
                contentContainerStyle={[
                  styles.listContent,
                  { paddingBottom: listBottomPad },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                onScroll={(e) => {
                  scrollAtTop.current = e.nativeEvent.contentOffset.y <= SCROLL_AT_TOP_THRESHOLD;
                }}
                scrollEventThrottle={16}
                onContentSizeChange={(contentWidth, contentHeight) => {
                  if (contentHeight <= 0) return;
                  if (scrollAfterPostRef.current == null) return;
                  runPostedScrollIfPending();
                }}
                onScrollToIndexFailed={({index, averageItemLength}) => {
                  const offset = Math.max(0, (averageItemLength || 72) * index - 60);
                  flatListRef.current?.scrollToOffset({offset, animated: true});
                }}
              />
            </LinearGradient>
          </Animated.View>
        </GestureDetector>

        {visible ? (
          <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            {renderFloatingInputDock()}
          </View>
        ) : null}
      </View>
    </Modal>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)', // dim like screenshot
  },

  sheetWrap: {
    height: SHEET_HEIGHT,
    width: '100%',
  },

  sheet: {
    flex: 1,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
  },

  dragArea: {
    minHeight: 56,
    paddingBottom: 4,
    justifyContent: 'flex-start',
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 70,
    height: 5,
    borderRadius: 99,
    backgroundColor: '#111',
    opacity: 0.55,
  },

  headerTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    paddingVertical: 10,
  },

  listContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
  },
  replyRow: {
    paddingLeft: 56,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#DDD',
  },

  textBlock: {
    flex: 1,
    paddingRight: 10,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  deleteIconWrap: {
    marginLeft: 'auto',
    padding: 6,
  },

  nameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
  },

  timeText: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '600',
  },

  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#111',
  },

  replyBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },

  replyText: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '700',
  },

  floatingInputDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#F6F2E6',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    paddingTop: 10,
    zIndex: 20,
    elevation: 20,
  },
  inputDock: {
    paddingHorizontal: 8,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  meAvatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#DDD',
  },

  inputWrap: {
    flex: 1,
  },
  replyingToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  replyingToText: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '600',
    flex: 1,
  },
  cancelReplyText: {
    fontSize: 12,
    color: '#111',
    fontWeight: '700',
  },

  inputPill: {
    flex: 1,
    minHeight: 50,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.16)',
    paddingLeft: 14,
    paddingRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    paddingVertical: 0,
  },

  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
