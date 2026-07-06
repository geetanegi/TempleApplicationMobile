import React, { useCallback, useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  Image,
  InteractionManager,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getUserId } from '../../../redux/store/getState';
import { openUserProfile } from '../../../utils/navigation/openUserProfile';
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

const ReelCommentsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { reelId, reel } = route.params || {};
  const currentUserId = getUserId();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const scrollAfterPostRef = useRef(false);
  const postedScrollFallbackTimerRef = useRef(null);

  useEffect(() => {
    if (reelId) {
      setLoading(true);
      getReelComments(reelId)
        .then((res) => {
          const data = res?.data ?? [];
          setComments(Array.isArray(data) ? data : []);
        })
        .catch(() => setComments([]))
        .finally(() => setLoading(false));
    }
  }, [reelId]);

  const runPostedScrollToEnd = useCallback(() => {
    if (!scrollAfterPostRef.current) return;
    if (!flatListRef.current) return;
    scrollAfterPostRef.current = false;
    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        });
      });
    });
  }, []);

  useLayoutEffect(() => {
    if (!scrollAfterPostRef.current) return;
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
  }, [comments, runPostedScrollToEnd]);

  useEffect(() => {
    return () => {
      scrollAfterPostRef.current = false;
      if (postedScrollFallbackTimerRef.current != null) {
        clearTimeout(postedScrollFallbackTimerRef.current);
      }
    };
  }, []);

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
        scrollAfterPostRef.current = true;
      }
      inputRef.current?.blur?.();
      Keyboard.dismiss();
    } catch (e) {
      setInputText(content);
    } finally {
      setSubmitting(false);
    }
  }, [inputText, currentUserId, reelId, submitting]);

  const openProfile = (userId) => {
    if (userId == null) return;
    openUserProfile(navigation, userId);
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
              setComments((prev) =>
                prev.filter((c) => String(c.id) !== String(item.id)),
              );
            } catch (e) {
              console.warn('Delete reel comment error:', e);
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]);
    },
    [reelId, currentUserId],
  );

  const renderComment = ({ item }) => {
    const avatarUrl =
      getProfilePictureUrlByUserId(item.user?.id) ||
      resolveProfilePictureUrl(item.user?.avatarUrl);
    const uid = item.user?.id ?? item.userId;
    const initial = (item.user?.name || item.user?.username || '?').charAt(0);
    const canDelete =
      currentUserId != null && String(uid) === String(currentUserId);

    return (
      <View style={styles.commentRow}>
        <Pressable
          style={styles.avatarWrap}
          onPress={() => openProfile(uid)}
          disabled={uid == null}
          hitSlop={4}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarLetter}>{initial}</Text>
            </View>
          )}
        </Pressable>
        <View style={styles.commentBody}>
          <View style={styles.commentTitleRow}>
            <Pressable
              style={styles.commentUserPress}
              onPress={() => openProfile(uid)}
              disabled={uid == null}
              hitSlop={4}
            >
              <Text style={styles.commentUser}>
                {item.user?.name || item.user?.username || 'User'}
              </Text>
            </Pressable>
            {canDelete && (
              <Pressable
                hitSlop={10}
                style={styles.deleteIconWrap}
                onPress={() => handleDeletePress(item)}
                disabled={String(deletingId) === String(item.id)}
              >
                {String(deletingId) === String(item.id) ? (
                  <ActivityIndicator size="small" color="#888" />
                ) : (
                  <Ionicons name="trash-outline" size={18} color="#888" />
                )}
              </Pressable>
            )}
          </View>
          <Text style={styles.commentText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Comments</Text>
        <View style={{ width: 28 }} />
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
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
            </View>
          }
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={(contentWidth, contentHeight) => {
            if (contentHeight <= 0) return;
            if (!scrollAfterPostRef.current) return;
            runPostedScrollToEnd();
          }}
        />
      )}

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={0}
        enabled={true}
        style={styles.inputAvoid}
      >
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            blurOnSubmit={false}
            onFocus={() => {
              setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
            }}
          />
          <Pressable
            onPress={submitComment}
            disabled={!inputText.trim() || submitting}
            style={[styles.sendBtn, (!inputText.trim() || submitting) && styles.sendBtnDisabled]}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={22} color="#fff" />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, paddingBottom: 80 },
  empty: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 15, color: '#888' },
  commentRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  avatarWrap: { marginRight: 12, marginTop: 2 },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.orange || '#D48A4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: { fontSize: 16, fontWeight: '700', color: '#fff' },
  commentBody: { flex: 1 },
  commentTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  commentUserPress: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    flexShrink: 1,
    lineHeight: 18,
  },
  deleteIconWrap: {
    padding: 4,
    flexShrink: 0,
  },
  commentText: { fontSize: 14, color: '#333', lineHeight: 20 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#000',
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
  inputAvoid: {
    paddingBottom: 20,
  },
});

export default ReelCommentsScreen;
