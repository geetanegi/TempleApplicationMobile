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
} from 'react-native';
import { Send, ChevronLeft, User } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProfilePictureUrlByUserId, resolveProfilePictureUrl } from '../../../utils/apicalls/profileHandler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getUserId } from '../../../redux/store/getState';
import { getChatMessages, sendChatMessage } from '../../../utils/apicalls/socialHandler';
import { connectWebSocket, subscribeChatThread, unsubscribeChatThread } from '../../../utils/services/websocketService';
import { preloadChatSounds, playSendSound, playReceiveSound } from '../../../utils/chatSounds';
import { formatDateTimeIST } from '../../../utils/helperfunctions/dateTimeUtils';
import { colors } from '../../../global/theme';

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
  const [avatarError, setAvatarError] = useState(false);
  const flatListRef = useRef(null);
  const loaderTimerRef = useRef(null);

  const loadMessages = useCallback(async () => {
    if (!threadId) return;
    if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current);
    loaderTimerRef.current = setTimeout(() => setShowSpinner(true), 600); // Only show spinner if API takes >600ms
    try {
      const res = await getChatMessages(threadId, 0, 50);
      const list = Array.isArray(res?.data) ? res.data : [];
      setMessages(list);
    } catch (e) {
      console.warn('Load messages error', e);
    } finally {
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = null;
      }
      setShowSpinner(false);
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

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
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!threadId || !currentUserId) return;
    connectWebSocket(currentUserId, {}).then(() => {
      subscribeChatThread(threadId, (message) => {
        const isFromOther = message.senderId !== currentUserId && message.senderUsername !== 'You';
        if (isFromOther) playReceiveSound();
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === message.id || m.clientMessageId === message.clientMessageId);
          if (exists) return prev;
          return [...prev, message];
        });
      });
    });
    return () => unsubscribeChatThread(threadId);
  }, [threadId, currentUserId]);

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
    setMessages((prev) => [...prev, optimistic]);
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

  const renderMessage = ({ item }) => {
    const isMe = item.senderId === currentUserId || item.senderUsername === 'You';
    const timeStr = formatDateTimeIST(item.createdAt);
    return (
      <View style={[styles.bubbleWrap, isMe ? styles.bubbleWrapRight : styles.bubbleWrapLeft]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{item.content}</Text>
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
          onPress={() => otherUserId && navigation.navigate('Profiles', { userId: otherUserId })}
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
          onPress={() => otherUserId && navigation.navigate('Profiles', { userId: otherUserId })}
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
            keyExtractor={(item) => String(item.id || item.clientMessageId)}
            renderItem={renderMessage}
            contentContainerStyle={[styles.listContent, { paddingBottom: 80 }]}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
  bubbleWrap: { marginVertical: 4 },
  bubbleWrapLeft: { alignItems: 'flex-start' },
  bubbleWrapRight: { alignItems: 'flex-end' },
  bubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleMe: { backgroundColor: colors.orange || '#D48A4A' },
  bubbleThem: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0' },
  bubbleText: { fontSize: 16, color: '#000' },
  bubbleTextMe: { fontSize: 16, color: '#fff' },
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
