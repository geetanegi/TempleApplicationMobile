import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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

const ReelCommentsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { reelId, reel } = route.params || {};
  const currentUserId = getUserId();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
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
      }
    } catch (e) {
      setInputText(content);
    } finally {
      setSubmitting(false);
    }
  }, [inputText, currentUserId, reelId, submitting]);

  const renderComment = ({ item }) => {
    const avatarUrl =
      getProfilePictureUrlByUserId(item.user?.id) ||
      resolveProfilePictureUrl(item.user?.avatarUrl);
    const isOwn = item.user?.id === currentUserId;

    return (
      <View style={styles.commentRow}>
        <View style={styles.avatarWrap}>
          {avatarUrl ? (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarLetter}>
                {(item.user?.name || item.user?.username || '?').charAt(0)}
              </Text>
            </View>
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
          data={comments}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderComment}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
            </View>
          }
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
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
  list: { padding: 16, paddingBottom: 24 },
  empty: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 15, color: '#888' },
  commentRow: { flexDirection: 'row', marginBottom: 16 },
  avatarWrap: { marginRight: 12 },
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
  commentUser: { fontSize: 14, fontWeight: '700', color: '#000', marginBottom: 2 },
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
});

export default ReelCommentsScreen;
