import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getProfilePictureUrlByUserId, resolveProfilePictureUrl } from '../../../utils/apicalls/profileHandler';

const {height: SCREEN_H} = Dimensions.get('window');

const AVATAR = 'https://i.pravatar.cc/150?img=3';

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
  const [input, setInput] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const data = useMemo(() => buildCommentListWithReplies(comment ?? []), [comment]);

  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const scrollAtTop = useRef(true);
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
    }
  }, [visible]);

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

    if (replyingTo != null && typeof onSendReply === 'function') {
      await onSendReply(replyingTo.id, trimmed);
      setReplyingTo(null);
    } else if (typeof onSendComment === 'function') {
      await onSendComment(trimmed);
    }
    setInput('');
  };

  const getAvatarUri = (item) => {
    const v = item?.avatar;
    if (typeof v === 'string' && v.trim()) return resolveProfilePictureUrl(v) || v;
    if (v && typeof v === 'object' && typeof v.imageUrl === 'string') return resolveProfilePictureUrl(v.imageUrl) || v.imageUrl;
    return getProfilePictureUrlByUserId(item?.userId) || AVATAR;
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
    const canDelete = typeof onDeleteComment === 'function' && currentUserId != null && String(item?.userId) === String(currentUserId);
    return (
      <View style={[styles.row, isReply && styles.replyRow]}>
        <Image
          style={styles.avatar}
          source={{ uri: avatarUri }}
          resizeMode="cover"
        />

        <View style={styles.textBlock}>
          <View style={styles.titleRow}>
            <Text style={styles.nameText}>{item?.user ?? 'User'}</Text>
            <Text style={styles.timeText}>  •  19h</Text>
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

          <Text style={styles.bodyText}>{item?.text ?? ''}</Text>

          {!isReply && (
            <Pressable
              hitSlop={10}
              style={styles.replyBtn}
              onPress={() => setReplyingTo({ id: item.id, user: item?.user ?? 'User' })}
            >
              <Text style={styles.replyText}>Reply</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={close}>
      {/* Backdrop */}
      <Pressable style={StyleSheet.absoluteFill} onPress={close}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        />
      </Pressable>

      {/* Bottom Sheet - whole sheet swipeable down to close */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.sheetWrap,
            {
              transform: [{translateY: Animated.add(translateY, dragY)}],
            },
          ]}>
          <LinearGradient
            colors={['#E9D3A3', '#F6F2E6', '#F6F2E6']}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={styles.sheet}>
            {/* handle + header */}
            <View style={styles.dragArea} collapsable={false}>
              <View style={styles.handleWrap}>
                <View style={styles.handle} />
              </View>
              <Text style={styles.headerTitle}>Comments</Text>
            </View>

            <KeyboardAvoidingView
              style={styles.flex}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => `comment-${item?.id ?? item?.parentCommentId ?? index}-${index}`}
              renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                onScroll={(e) => {
                  const y = e.nativeEvent.contentOffset.y;
                  scrollAtTop.current = y <= SCROLL_AT_TOP_THRESHOLD;
                }}
                scrollEventThrottle={16}
              />

            {/* Fixed input – current user's profile avatar (same API as FollowListScreen) */}
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
                    value={input}
                    onChangeText={setInput}
                    placeholder={replyingTo ? 'Write a reply...' : 'Add a comment'}
                    placeholderTextColor="#8E8E8E"
                    style={styles.input}
                    returnKeyType="send"
                    onSubmitEditing={onSend}
                  />

                  <Pressable onPress={onSend} hitSlop={10} style={styles.actionBtn}>
                    <FontAwesome name="send" size={16} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
    </Modal>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  flex: {flex: 1},

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)', // dim like screenshot
  },

  sheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SHEET_HEIGHT,
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
    paddingBottom: 96, // so list doesn't hide behind input
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

  // bottom input
  inputDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(246,242,230,0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
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
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.16)',
    paddingLeft: 16,
    paddingRight: 8,
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
