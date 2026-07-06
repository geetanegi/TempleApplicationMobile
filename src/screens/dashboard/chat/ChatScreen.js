import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  InteractionManager,
  Linking,
} from 'react-native';
import { Send, ChevronLeft, User, Play } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProfilePictureUrlByUserId, resolveProfilePictureUrl } from '../../../utils/apicalls/profileHandler';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getUserId } from '../../../redux/store/getState';
import { getChatMessages, sendChatMessage, markChatThreadRead, getPostById } from '../../../utils/apicalls/socialHandler';
import { getReelById } from '../../../utils/apicalls/reelHandler';
import { connectWebSocket, subscribeChatThread, unsubscribeChatThread } from '../../../utils/services/websocketService';
import { preloadChatSounds, playSendSound, playReceiveSound } from '../../../utils/chatSounds';
import { openUserProfile } from '../../../utils/navigation/openUserProfile';
import { formatDateTimeIST } from '../../../utils/helperfunctions/dateTimeUtils';
import { colors } from '../../../global/theme';

const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
const CHAT_PAGE_SIZE = 30;

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { threadId, otherUserId, otherUsername, otherName, otherUserHandle } = route.params || {};
  const currentUserId = getUserId();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  const [reelPreviewMap, setReelPreviewMap] = useState({});
  const [postPreviewMap, setPostPreviewMap] = useState({});
  const flatListRef = useRef(null);
  const loaderTimerRef = useRef(null);
  const requestedReelIdsRef = useRef(new Set());
  const requestedPostIdsRef = useRef(new Set());

  const extractReelIdFromText = useCallback((value) => {
    const text = String(value || '');
    const match =
      text.match(/(?:https?:\/\/)?(?:www\.)?jainsansaar\.app\/reel\/([^?\s]+)/i) ||
      text.match(/\/reel\/([^?\s]+)/i) ||
      text.match(/reelId=([^&\s]+)/i);
    if (!match?.[1]) return null;
    const cleaned = String(match[1]).replace(/[)\].,;!?]+$/g, '');
    return cleaned || null;
  }, []);

  const extractPostIdFromText = useCallback((value) => {
    const text = String(value || '');
    const match =
      text.match(/(?:https?:\/\/)?(?:www\.)?jainsansaar\.app\/post\/([^?\s]+)/i) ||
      text.match(/jainsansaar:\/\/post\/([^?\s]+)/i) ||
      text.match(/\/post\/([^?\s]+)/i) ||
      text.match(/postId=([^&\s]+)/i);
    if (!match?.[1]) return null;
    const cleaned = String(match[1]).replace(/[)\].,;!?]+$/g, '');
    return cleaned || null;
  }, []);

  const openReelInApp = useCallback((reelId) => {
    if (!reelId) return;
    const tabNav = navigation.getParent()?.getParent?.();
    if (tabNav) {
      tabNav.navigate('Video', {
        screen: 'ReelsFeed',
        params: { reelId },
      });
      return;
    }
    navigation.navigate('Video', {
      screen: 'ReelsFeed',
      params: { reelId },
    });
  }, [navigation]);

  const openPostInApp = useCallback((postId) => {
    if (!postId) return;
    const tabNav = navigation.getParent()?.getParent?.();
    (tabNav || navigation.getParent() || navigation).navigate('Home', {
      screen: 'PostPreview',
      params: { postId: Number(postId) || postId },
    });
  }, [navigation]);

  const loadMessages = useCallback(async (pageNum = 0, append = false) => {
    if (!threadId) return;
    if (!append) {
      if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current);
      loaderTimerRef.current = setTimeout(() => setShowSpinner(true), 600);
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const res = await getChatMessages(threadId, pageNum, CHAT_PAGE_SIZE);
      const list = Array.isArray(res?.data) ? [...res.data] : [];
      // Keep messages newest-first for inverted list.
      list.sort((a, b) => {
        const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });

      if (append) {
        setMessages((prev) => {
          const seen = new Set(prev.map((m) => m.id || m.clientMessageId));
          const older = list.filter((m) => !seen.has(m.id || m.clientMessageId));
          return [...prev, ...older];
        });
      } else {
        setMessages(list);
      }

      setPage(pageNum);
      setHasMore(list.length >= CHAT_PAGE_SIZE);
    } catch (e) {
      console.warn('Load messages error', e);
    } finally {
      if (!append) {
        if (loaderTimerRef.current) {
          clearTimeout(loaderTimerRef.current);
          loaderTimerRef.current = null;
        }
        setShowSpinner(false);
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [threadId]);

  useEffect(() => {
    loadMessages(0, false);
  }, [loadMessages]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
  }, [threadId]);

  useFocusEffect(
    useCallback(() => {
      if (threadId && currentUserId) {
        markChatThreadRead(threadId, currentUserId).catch(() => {});
      }
    }, [threadId, currentUserId]),
  );

  useEffect(() => () => {
    if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current);
  }, []);

  useEffect(() => {
    setAvatarError(false);
  }, [otherUserId]);

  useEffect(() => {
    preloadChatSounds();
  }, []);

  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true }), 150);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!threadId || !currentUserId) return;
    connectWebSocket(currentUserId, {}).then(() => {
      subscribeChatThread(threadId, (message) => {
        const isFromOther = message.senderId !== currentUserId && message.senderUsername !== 'You';
        if (isFromOther) {
          playReceiveSound();
          markChatThreadRead(threadId, currentUserId).catch(() => {});
        }
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === message.id || m.clientMessageId === message.clientMessageId);
          if (exists) return prev;
          return [message, ...prev];
        });
      });
    });
    return () => unsubscribeChatThread(threadId);
  }, [threadId, currentUserId]);

  const loadOlderMessages = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    loadMessages(page + 1, true);
  }, [loading, loadingMore, hasMore, loadMessages, page]);

  useEffect(() => {
    if (!currentUserId || messages.length === 0) return;
    const reelIds = Array.from(
      new Set(
        messages
          .map((m) => extractReelIdFromText(m?.content))
          .filter(Boolean),
      ),
    );
    reelIds.forEach((reelId) => {
      if (requestedReelIdsRef.current.has(reelId)) return;
      requestedReelIdsRef.current.add(reelId);
      getReelById(reelId, currentUserId)
        .then((res) => {
          const reel = res?.data || {};
          setReelPreviewMap((prev) => ({
            ...prev,
            [reelId]: {
              id: reelId,
              caption: reel?.caption || '',
              thumbnailUrl: reel?.thumbnailUrl || '',
            },
          }));
        })
        .catch(() => {
          setReelPreviewMap((prev) => ({
            ...prev,
            [reelId]: {
              id: reelId,
              caption: '',
              thumbnailUrl: '',
            },
          }));
        });
    });
  }, [messages, currentUserId, extractReelIdFromText]);

  useEffect(() => {
    if (!currentUserId || messages.length === 0) return;
    const postIds = Array.from(
      new Set(
        messages
          .map((m) => extractPostIdFromText(m?.content))
          .filter(Boolean),
      ),
    );
    postIds.forEach((postId) => {
      if (requestedPostIdsRef.current.has(postId)) return;
      requestedPostIdsRef.current.add(postId);
      getPostById(postId, currentUserId)
        .then((res) => {
          const post = res?.data || {};
          setPostPreviewMap((prev) => ({
            ...prev,
            [postId]: {
              id: postId,
              contentText: post?.contentText || '',
              photoUrl: post?.photoUrl || post?.thumbnailUrl || '',
            },
          }));
        })
        .catch(() => {
          setPostPreviewMap((prev) => ({
            ...prev,
            [postId]: {
              id: postId,
              contentText: '',
              photoUrl: '',
            },
          }));
        });
    });
  }, [messages, currentUserId, extractPostIdFromText]);

  const send = useCallback(async () => {
    const text = (input || '').trim();
    if (!text || !threadId || !currentUserId || sending) return;
    const clientMessageId = uuid();
    setInput('');
    setSending(true);
    const optimistic = {
      id: 'temp-' + clientMessageId,
      threadId,
      senderId: currentUserId,
      senderUsername: 'You',
      clientMessageId,
      contentType: 'text',
      content: text,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };
    setMessages((prev) => [optimistic, ...prev]);
    playSendSound();
    try {
      const res = await sendChatMessage(threadId, currentUserId, clientMessageId, text, 'text');
      const saved = res?.data;
      setMessages((prev) =>
        prev.map((m) => (m.clientMessageId === clientMessageId ? { ...m, ...saved, id: saved?.id, status: 'sent' } : m))
      );
    } catch (e) {
      setMessages((prev) => prev.map((m) => (m.clientMessageId === clientMessageId ? { ...m, status: 'failed' } : m)));
      console.warn('Send message error', e);
    } finally {
      setSending(false);
    }
  }, [input, threadId, currentUserId, sending]);

  const openMessageLink = useCallback(async (url) => {
    let target = (url || '').trim().replace(/[.,;:!?)\]]+$/, '');
    if (!target) return;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = `https://${target}`;
    }

    const reelMatch = target.match(/\/reel\/([^/?#]+)/i);
    if (reelMatch?.[1]) {
      openReelInApp(reelMatch[1]);
      return;
    }

    const postMatch =
      target.match(/\/post\/([^/?#]+)/i) ||
      target.match(/jainsansaar:\/\/post\/([^/?#]+)/i);
    if (postMatch?.[1]) {
      openPostInApp(postMatch[1]);
      return;
    }

    try {
      await Linking.openURL(target);
    } catch (e) {
      console.warn('Open URL error', e);
    }
  }, [openReelInApp, openPostInApp]);

  const renderMessageContent = useCallback((content, isMe) => {
    const text = String(content || '');
    const parts = text.split(URL_REGEX).filter(Boolean);

    return (
      <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
        {parts.map((part, index) => {
          const isUrl = /^(https?:\/\/|www\.)/i.test(part);
          if (!isUrl) return part;
          return (
            <Text
              key={`${part}-${index}`}
              style={[styles.linkText, isMe && styles.linkTextMe]}
              onPress={() => openMessageLink(part)}
            >
              {part}
            </Text>
          );
        })}
      </Text>
    );
  }, [openMessageLink]);

  const renderMessage = ({ item }) => {
    const isMe = item.senderId === currentUserId || item.senderUsername === 'You';
    const timeStr = formatDateTimeIST(item.createdAt);
    const reelId = extractReelIdFromText(item?.content);
    const postId = extractPostIdFromText(item?.content);
    const reelPreview = reelId ? reelPreviewMap[reelId] : null;
    const postPreview = postId ? postPreviewMap[postId] : null;
    const hasMediaPreview = Boolean(reelId || postId);
    return (
      <View style={[styles.bubbleWrap, isMe ? styles.bubbleWrapRight : styles.bubbleWrapLeft]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          {!hasMediaPreview ? renderMessageContent(item.content, isMe) : null}
          {reelId ? (
            <Pressable
              onPress={() => openReelInApp(reelId)}
              style={[styles.reelPreviewCard, isMe && styles.reelPreviewCardMe]}
            >
              <View style={styles.reelPreviewMediaWrap}>
                {reelPreview?.thumbnailUrl ? (
                  <Image source={{ uri: reelPreview.thumbnailUrl }} style={styles.reelPreviewImage} resizeMode="cover" />
                ) : (
                  <View style={styles.reelPreviewFallback} />
                )}
                <View style={styles.reelPlayOverlay}>
                  <Play size={18} color="#fff" strokeWidth={2.4} />
                </View>
              </View>
              <View style={styles.reelPreviewTextWrap}>
                <Text style={[styles.reelPreviewTitle, isMe && styles.reelPreviewTitleMe]}>Reel Preview</Text>
                <Text
                  style={[styles.reelPreviewSubtitle, isMe && styles.reelPreviewSubtitleMe]}
                  numberOfLines={1}
                >
                  {reelPreview?.caption?.trim() || 'Tap to open reel'}
                </Text>
              </View>
            </Pressable>
          ) : null}
          {postId && !reelId ? (
            <Pressable
              onPress={() => openPostInApp(postId)}
              style={[styles.reelPreviewCard, isMe && styles.reelPreviewCardMe]}
            >
              <View style={styles.reelPreviewMediaWrap}>
                {postPreview?.photoUrl ? (
                  <Image source={{ uri: postPreview.photoUrl }} style={styles.reelPreviewImage} resizeMode="cover" />
                ) : (
                  <View style={styles.reelPreviewFallback} />
                )}
              </View>
              <View style={styles.reelPreviewTextWrap}>
                <Text style={[styles.reelPreviewTitle, isMe && styles.reelPreviewTitleMe]}>Post Preview</Text>
                <Text
                  style={[styles.reelPreviewSubtitle, isMe && styles.reelPreviewSubtitleMe]}
                  numberOfLines={2}
                >
                  {postPreview?.contentText?.trim() || 'Tap to view post'}
                </Text>
              </View>
            </Pressable>
          ) : null}
          {item.status === 'sending' && <Text style={styles.sendingLabel}>Sending...</Text>}
          {item.status === 'failed' && <Text style={styles.failedLabel}>Failed</Text>}
          {timeStr ? <Text style={[styles.timeLabel, isMe && styles.timeLabelMe]}>{timeStr}</Text> : null}
        </View>
      </View>
    );
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (!threadId) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.error}>Missing thread</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable hitSlop={12} onPress={() => navigation.goBack()} style={styles.headerBack}>
          <ChevronLeft size={28} color={colors.orange || '#D48A4A'} strokeWidth={2} />
        </Pressable>
        <Pressable
          style={styles.headerProfile}
          onPress={() => otherUserId && openUserProfile(navigation, otherUserId)}
        >
          {(() => {
            const url = otherUserId ? getProfilePictureUrlByUserId(otherUserId) : null;
            const avatarUrl = url ? (resolveProfilePictureUrl(url) || url) : null;
            const showIcon = !avatarUrl || avatarError;
            return showIcon ? (
              <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
                <User size={22} color="#fff" strokeWidth={2} />
              </View>
            ) : (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.headerAvatar}
                resizeMode="cover"
                onError={() => setAvatarError(true)}
              />
            );
          })()}
        </Pressable>
        <Pressable
          style={styles.headerNameWrap}
          onPress={() => otherUserId && openUserProfile(navigation, otherUserId)}
        >
          <Text style={styles.headerName} numberOfLines={1}>
            {otherName || otherUsername || 'Chat'}
          </Text>
          {otherUserHandle ? (
            <Text style={styles.headerUsername} numberOfLines={1}>
              @{String(otherUserHandle).replace(/^@/, '')}
            </Text>
          ) : null}
        </Pressable>
        <View style={styles.headerBack} />
      </View>
      <View style={styles.contentArea}>
        {loading && showSpinner ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.orange} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            inverted
            keyExtractor={(item) => String(item.id || item.clientMessageId)}
            renderItem={renderMessage}
            contentContainerStyle={[styles.listContent, { paddingBottom: 80 }]}
            onEndReached={loadOlderMessages}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.loaderMoreWrap}>
                  <ActivityIndicator size="small" color={colors.orange || '#D48A4A'} />
                </View>
              ) : null
            }
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={0}
        enabled={true}
        style={styles.inputAvoid}
      >
        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Message..."
              placeholderTextColor="#999"
              multiline
              maxLength={2000}
              onSubmitEditing={send}
            />
            {input.trim() ? (
              <Pressable
                onPress={send}
                disabled={sending}
                style={({ pressed }) => [
                  styles.iconBtn,
                  (pressed || sending) && styles.iconBtnDisabled,
                ]}
              >
                <Send size={22} color={colors.orange || '#D48A4A'} strokeWidth={2.5} />
              </Pressable>
            ) : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerBack: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerProfile: {
    marginRight: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerAvatarPlaceholder: {
    backgroundColor: colors.orange || '#D48A4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerNameWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B1B1B',
  },
  headerUsername: {
    fontSize: 12,
    color: '#666',
    marginTop: 1,
  },
  contentArea: { flex: 1 },
  inputAvoid: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    paddingBottom: 20,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#666' },
  listContent: { padding: 12 },
  loaderMoreWrap: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  bubbleWrap: { marginVertical: 4 },
  bubbleWrapLeft: { alignItems: 'flex-start' },
  bubbleWrapRight: { alignItems: 'flex-end' },
  bubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleMe: { backgroundColor: colors.orange || '#D48A4A' },
  bubbleThem: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0' },
  bubbleText: { fontSize: 16, color: '#000' },
  bubbleTextMe: { fontSize: 16, color: '#fff' },
  linkText: {
    color: '#1d4ed8',
    textDecorationLine: 'underline',
  },
  linkTextMe: {
    color: '#dbeafe',
  },
  reelPreviewCard: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reelPreviewCardMe: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  reelPreviewImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#111',
  },
  reelPreviewMediaWrap: {
    position: 'relative',
  },
  reelPreviewFallback: {
    width: '100%',
    height: 90,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reelPlayOverlay: {
    position: 'absolute',
    alignSelf: 'center',
    top: '42%',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reelPreviewTextWrap: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  reelPreviewTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  reelPreviewTitleMe: {
    color: '#fff',
  },
  reelPreviewSubtitle: {
    fontSize: 12,
    color: '#4b5563',
  },
  reelPreviewSubtitleMe: {
    color: 'rgba(255,255,255,0.85)',
  },
  sendingLabel: { fontSize: 11, color: 'rgba(0,0,0,0.5)', marginTop: 4 },
  failedLabel: { fontSize: 11, color: '#c00', marginTop: 4 },
  timeLabel: { fontSize: 10, color: 'rgba(0,0,0,0.5)', marginTop: 4 },
  timeLabelMe: { color: 'rgba(255,255,255,0.8)' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 10 },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    minHeight: 44,
    maxHeight: 100,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 96,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 44,
    fontSize: 16,
    color: '#000',
  },
  iconBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    padding: 4,
  },
  iconBtnDisabled: { opacity: 0.5 },
});
