import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  Modal,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  InteractionManager,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getUserId } from '../../../redux/store/getState';
import {
  getReelComments,
  commentOnReel,
  deleteReelComment,
} from '../../../utils/apicalls/reelHandler';
import {
  getProfilePictureUrlByUserId,
  resolveProfilePictureUrl,
} from '../../../utils/apicalls/profileHandler';
import { colors } from '../../../global/theme';

const AVATAR = 'https://i.pravatar.cc/150?img=3';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_HEIGHT = Math.round(SCREEN_H * 0.78);
/** Space under list so items can scroll above the floating input dock */
const LIST_BOTTOM_PADDING_FOR_INPUT = 108;
const DRAG_CLOSE_THRESHOLD = 70;
const VELOCITY_CLOSE_THRESHOLD = 350;
const SCROLL_AT_TOP_THRESHOLD = 10;

function getMyAvatarUri(userId) {
  if (userId == null) return AVATAR;
  const url = getProfilePictureUrlByUserId(userId);
  const resolved = resolveProfilePictureUrl(url || '');
  if (resolved && (resolved.startsWith('http://') || resolved.startsWith('https://'))) {
    return resolved;
  }
  return AVATAR;
}

function getCommentAvatarUri(item) {
  const v =
    getProfilePictureUrlByUserId(item?.user?.id) ||
    resolveProfilePictureUrl(item?.user?.userProfile || item?.user?.avatarUrl);
  if (typeof v === 'string' && v.trim()) return v;
  return AVATAR;
}

const ReelCommentsOverlay = ({ visible, onClose, reelId, reel, onCommentAdded, onCommentDeleted }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const currentUserId = getUserId();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const scrollAtTop = useRef(true);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  /** True after posting until scrollToEnd runs (scrollToEnd is unreliable before content size is known). */
  const scrollAfterPostRef = useRef(false);
  const postedScrollFallbackTimerRef = useRef(null);

  const runCloseAnimation = useCallback(() => {
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
    ]).start(() => onClose());
  }, [translateY, dragY, backdropOpacity, onClose]);

  const runSnapBack = useCallback(() => {
    Animated.spring(dragY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 22,
      stiffness: 320,
    }).start();
  }, [dragY]);

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
        const { translationY, velocityY } = e;
        const shouldClose =
          translationY > DRAG_CLOSE_THRESHOLD || velocityY > VELOCITY_CLOSE_THRESHOLD;
        if (shouldClose) {
          runCloseAnimation();
        } else {
          runSnapBack();
        }
      })
  ).current;

  useEffect(() => {
    if (visible && reelId) {
      setLoading(true);
      getReelComments(reelId)
        .then((res) => {
          const data = res?.data ?? [];
          setComments(Array.isArray(data) ? data : []);
        })
        .catch(() => setComments([]))
        .finally(() => setLoading(false));
    } else {
      setInputText('');
      setKeyboardHeight(0);
      scrollAfterPostRef.current = false;
      if (postedScrollFallbackTimerRef.current != null) {
        clearTimeout(postedScrollFallbackTimerRef.current);
        postedScrollFallbackTimerRef.current = null;
      }
    }
  }, [visible, reelId]);

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

  const runPostedScrollToEnd = useCallback(() => {
    if (!scrollAfterPostRef.current || !visible) return;
    if (!flatListRef.current) return;
    scrollAfterPostRef.current = false;
    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        });
      });
    });
  }, [visible]);

  /** Fallback if onContentSizeChange did not run. */
  useLayoutEffect(() => {
    if (!scrollAfterPostRef.current || !visible) return;
    if (postedScrollFallbackTimerRef.current != null) {
      clearTimeout(postedScrollFallbackTimerRef.current);
    }
    postedScrollFallbackTimerRef.current = setTimeout(() => {
      postedScrollFallbackTimerRef.current = null;
      if (scrollAfterPostRef.current) {
        runPostedScrollToEnd();
      }
    }, 400);
    return () => {
      if (postedScrollFallbackTimerRef.current != null) {
        clearTimeout(postedScrollFallbackTimerRef.current);
        postedScrollFallbackTimerRef.current = null;
      }
    };
  }, [comments, visible, runPostedScrollToEnd]);

  const submitComment = useCallback(async () => {
    const content = inputText.trim();
    if (!content || !currentUserId || !reelId || submitting) return;
    setSubmitting(true);
    setInputText('');
    try {
      const res = await commentOnReel(reelId, currentUserId, content);
      const newComment = res?.data;
      if (newComment) {
        setComments((prev) => [...prev, newComment]);
        onCommentAdded?.(reelId, (reel?.commentsCount ?? 0) + 1);
        scrollAfterPostRef.current = true;
      }
      inputRef.current?.blur?.();
      Keyboard.dismiss();
    } catch (e) {
      setInputText(content);
    } finally {
      setSubmitting(false);
    }
  }, [inputText, currentUserId, reelId, submitting, reel?.commentsCount, onCommentAdded]);

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
          <View style={styles.inputPill}>
            <TextInput
              ref={inputRef}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Add a comment"
              placeholderTextColor="#8E8E8E"
              style={styles.input}
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={submitComment}
              multiline
              maxLength={500}
            />
            <Pressable
              onPress={submitComment}
              hitSlop={10}
              disabled={!inputText.trim() || submitting}
              style={[
                styles.actionBtn,
                (!inputText.trim() || submitting) && styles.actionBtnDisabled,
              ]}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <FontAwesome name="send" size={16} color="#FFFFFF" />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );

  const openProfile = (userId) => {
    if (userId == null) return;
    navigation.navigate('Profiles', { userId });
  };

  const handleDeletePress = useCallback(
    (item) => {
      if (reelId == null || currentUserId == null) return;
      Alert.alert('Delete comment', 'Are you sure you want to delete this comment?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const cid = item.id;
            setDeletingId(cid);
            try {
              await deleteReelComment(reelId, cid, currentUserId);
              const nextCount = Math.max(0, comments.length - 1);
              setComments((prev) =>
                prev.filter((c) => String(c.id) !== String(item.id)),
              );
              onCommentDeleted?.(reelId, nextCount);
            } catch (e) {
              console.warn('Delete reel comment error:', e);
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]);
    },
    [reelId, currentUserId, comments.length, onCommentDeleted],
  );

  const renderComment = ({ item }) => {
    const avatarUri = getCommentAvatarUri(item);
    const userDisplay = item.user?.name || item.user?.username || 'User';
    const uid = item.user?.id ?? item.userId;
    const canDelete =
      currentUserId != null && String(uid) === String(currentUserId);

    return (
      <View style={styles.row}>
        <Pressable onPress={() => openProfile(uid)} disabled={uid == null} hitSlop={4}>
          <Image style={styles.avatar} source={{ uri: avatarUri }} resizeMode="cover" />
        </Pressable>
        <View style={styles.textBlock}>
          <View style={styles.titleRow}>
            <Pressable onPress={() => openProfile(uid)} disabled={uid == null} hitSlop={4}>
              <Text style={styles.nameText}>{userDisplay}</Text>
            </Pressable>
            {canDelete && (
              <Pressable
                hitSlop={10}
                style={styles.deleteIconWrap}
                onPress={() => handleDeletePress(item)}
                disabled={String(deletingId) === String(item.id)}
              >
                {String(deletingId) === String(item.id) ? (
                  <ActivityIndicator size="small" color="#8E8E8E" />
                ) : (
                  <FontAwesome name="trash-o" size={16} color="#8E8E8E" />
                )}
              </Pressable>
            )}
          </View>
          <Text style={styles.bodyText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={runCloseAnimation}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        <Pressable style={StyleSheet.absoluteFill} onPress={runCloseAnimation}>
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </Pressable>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.sheetWrap,
              {
                transform: [{ translateY: Animated.add(translateY, dragY) }],
              },
            ]}
          >
            <LinearGradient
              colors={['#E9D3A3', '#F6F2E6', '#F6F2E6']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.sheet}
            >
              <View style={styles.dragArea} collapsable={false}>
                <View style={styles.handleWrap}>
                  <View style={styles.handle} />
                </View>
                <Text style={styles.headerTitle}>Comments</Text>
              </View>

              {loading ? (
                <View style={styles.centered}>
                  <ActivityIndicator size="large" color={colors.orange || '#D48A4A'} />
                </View>
              ) : (
                <FlatList
                  ref={flatListRef}
                  data={comments}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={renderComment}
                  style={styles.flex}
                  contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: LIST_BOTTOM_PADDING_FOR_INPUT },
                  ]}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    <View style={styles.empty}>
                      <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
                    </View>
                  }
                  onScroll={(e) => {
                    const y = e.nativeEvent.contentOffset.y;
                    scrollAtTop.current = y <= SCROLL_AT_TOP_THRESHOLD;
                  }}
                  scrollEventThrottle={16}
                  onContentSizeChange={(contentWidth, contentHeight) => {
                    if (contentHeight <= 0) return;
                    if (!scrollAfterPostRef.current) return;
                    runPostedScrollToEnd();
                  }}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                />
              )}
            </LinearGradient>
          </Animated.View>
        </GestureDetector>

        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          {renderFloatingInputDock()}
        </View>
      </View>
    </Modal>
  );
};

export default ReelCommentsOverlay;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
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
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#111',
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
  actionBtnDisabled: {
    opacity: 0.45,
  },
});
