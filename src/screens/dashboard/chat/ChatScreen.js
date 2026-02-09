import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getUserId } from '../../../redux/store/getState';
import { getChatMessages, sendChatMessage } from '../../../utils/apicalls/socialHandler';
import { connectWebSocket, subscribeChatThread, unsubscribeChatThread } from '../../../utils/services/websocketService';
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
  const { threadId, otherUserId, otherUsername } = route.params || {};
  const currentUserId = getUserId();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  const loadMessages = useCallback(async () => {
    if (!threadId) return;
    try {
      const res = await getChatMessages(threadId, 0, 50);
      const list = Array.isArray(res?.data) ? res.data : [];
      setMessages(list);
    } catch (e) {
      console.warn('Load messages error', e);
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!threadId || !currentUserId) return;
    connectWebSocket(currentUserId, {}).then(() => {
      subscribeChatThread(threadId, (message) => {
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
    return (
      <View style={[styles.bubbleWrap, isMe ? styles.bubbleWrapRight : styles.bubbleWrapLeft]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{item.content}</Text>
          {item.status === 'sending' && <Text style={styles.sendingLabel}>Sending...</Text>}
          {item.status === 'failed' && <Text style={styles.failedLabel}>Failed</Text>}
        </View>
      </View>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      title: otherUsername || 'Chat',
      headerTitleAlign: 'center',
    });
  }, [navigation, otherUsername]);

  if (!threadId) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.error}>Missing thread</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.orange} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => String(item.id || item.clientMessageId)}
            renderItem={renderMessage}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}
        <View style={styles.inputRow}>
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
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || sending) && styles.sendBtnDisabled]}
            onPress={send}
            disabled={!input.trim() || sending}
          >
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f5f5' },
  keyboard: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#666' },
  listContent: { padding: 12, paddingBottom: 24 },
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
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, backgroundColor: '#fff', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#ddd' },
  input: { flex: 1, minHeight: 40, maxHeight: 100, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 16, color: '#000', marginRight: 10 },
  sendBtn: { paddingVertical: 12, paddingHorizontal: 20, backgroundColor: colors.orange || '#D48A4A', borderRadius: 20, justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
