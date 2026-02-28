import React, { useCallback, useEffect, useRef, useState } from 'react';
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
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { X, Send } from 'lucide-react-native';
import { getUserId } from '../../../redux/store/getState';
import {
  getReelComments,
  commentOnReel,
} from '../../../utils/apicalls/reelHandler';
import {
  getProfilePictureUrlByUserId,
  resolveProfilePictureUrl,
} from '../../../utils/apicalls/profileHandler';
import { colors } from '../../../global/theme';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_HEIGHT = Math.round(SCREEN_H * 0.65);
const DRAG_CLOSE_THRESHOLD = 70;
const VELOCITY_CLOSE_THRESHOLD = 350;
const SCROLL_AT_TOP_THRESHOLD = 10;

const ReelCommentsOverlay = ({ visible, onClose, reelId, reel, onCommentAdded }) => {
  const currentUserId = getUserId();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        const h = e?.endCoordinates?.height ?? 0;
        setKeyboardHeight(Platform.OS === 'android' ? Math.max(0, h - 140) : Math.max(0, h - 100));
      },
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0),
    );
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
    const sub = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
    });
    return () => sub.remove();
  }, []);

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
      if (!visible) setKeyboardHeight(0);
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
      }
    } catch (e) {
      setInputText(content);
    } finally {
      setSubmitting(false);
    }
  }, [inputText, currentUserId, reelId, submitting, reel?.commentsCount, onCommentAdded]);

  const renderComment = ({ item }) => {
    const avatarUrl =
      getProfilePictureUrlByUserId(item.user?.id) ||
      resolveProfilePictureUrl(item.user?.userProfile || item.user?.avatarUrl);

    return (
      <View style={styles.commentRow}>
        <View style={styles.avatarWrap}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImg} resizeMode="cover" />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarLetter}>
                {(item.user?.name || item.user?.username || '?').charAt(0)}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.commentBody}>
          <Text style={styles.commentUser}>
            {item.user?.username || item.user?.name || 'User'}
          </Text>
          <Text style={styles.commentText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={runCloseAnimation} statusBarTranslucent>
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
          <View style={styles.sheet}>
            <View style={styles.dragArea} collapsable={false}>
              <View style={styles.handleWrap}>
                <View style={styles.handle} />
              </View>
              <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Comments</Text>
                <Pressable onPress={runCloseAnimation} hitSlop={12} style={styles.closeBtn}>
                  <X size={24} color="#fff" strokeWidth={2} />
                </Pressable>
              </View>
            </View>

            {/* List stays fixed – only input moves up with keyboard */}
            <View style={styles.contentArea}>
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
                  contentContainerStyle={styles.list}
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
                  keyboardShouldPersistTaps="handled"
                  onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
              )}
            </View>

            {/* Input bar: absolute at bottom, moves up by keyboardHeight only – page stays fixed */}
            <View
              style={[
                styles.inputAvoid,
                styles.inputAbsolute,
                { bottom: keyboardHeight },
              ]}
            >
              <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    placeholderTextColor="#888"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    maxLength={500}
                    onFocus={() => {
                      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
                    }}
                  />
                  <Pressable
                    onPress={submitComment}
                    disabled={!inputText.trim() || submitting}
                    style={[
                      styles.sendBtn,
                      (!inputText.trim() || submitting) && styles.sendBtnDisabled,
                    ]}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Send size={22} color="#fff" strokeWidth={2} />
                    )}
                  </Pressable>
              </View>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
};

export default ReelCommentsOverlay;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  contentArea: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    backgroundColor: 'rgba(26,26,26,0.96)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  dragArea: {
    minHeight: 52,
    paddingBottom: 4,
    justifyContent: 'flex-start',
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  closeBtn: {
    padding: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#888',
  },
  commentRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarWrap: {
    marginRight: 12,
  },
  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#444',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.orange || '#D48A4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  commentBody: { flex: 1 },
  commentUser: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  inputAvoid: {
    backgroundColor: 'rgba(26,26,26,0.98)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 20,
  },
  inputAbsolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    elevation: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#fff',
    marginRight: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.orange || '#D48A4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: { opacity: 0.5 },
});
