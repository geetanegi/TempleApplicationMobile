import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { User } from 'lucide-react-native';
import { getProfilePictureUrlByUserId } from '../../utils/apicalls/profileHandler';

export default function ShareToChatSheet({
  visible,
  onClose,
  followingUsers = [],
  loadingFollowing = false,
  shareQuery = '',
  onShareQueryChange,
  sendingToUserId = null,
  onSendToUser,
  onMoreOptions,
  title = 'Share',
}) {
  const filteredFollowing = useMemo(() => {
    const q = (shareQuery || '').trim().toLowerCase();
    if (!q) return followingUsers;
    return followingUsers.filter((u) => {
      const name = `${u?.firstName || ''} ${u?.lastName || ''}`.trim().toLowerCase();
      const username = (u?.username || '').toLowerCase();
      return name.includes(q) || username.includes(q);
    });
  }, [followingUsers, shareQuery]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.wrap}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          <TextInput
            value={shareQuery}
            onChangeText={onShareQueryChange}
            placeholder="Search people"
            placeholderTextColor="#8e8e8e"
            style={styles.search}
          />

          {loadingFollowing ? (
            <View style={styles.loading}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <FlatList
              data={filteredFollowing}
              keyExtractor={(item, index) => String(item?.id ?? item?.userId ?? index)}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const uid = item?.id ?? item?.userId;
                const fullName =
                  `${item?.firstName || ''} ${item?.lastName || ''}`.trim() ||
                  item?.username ||
                  'User';
                const avatarUrl = uid ? getProfilePictureUrlByUserId(uid) : null;
                return (
                  <View style={styles.userRow}>
                    <View style={styles.userLeft}>
                      {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                      ) : (
                        <View style={[styles.avatar, styles.avatarFallback]}>
                          <User size={18} color="#fff" />
                        </View>
                      )}
                      <View>
                        <Text style={styles.name}>{fullName}</Text>
                        {item?.username ? (
                          <Text style={styles.username}>@{item.username}</Text>
                        ) : null}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.sendBtn}
                      disabled={sendingToUserId === uid}
                      onPress={() => onSendToUser?.(item)}
                    >
                      {sendingToUserId === uid ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.sendBtnText}>Send</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              }}
              ListEmptyComponent={<Text style={styles.emptyText}>No people found.</Text>}
            />
          )}

          {onMoreOptions ? (
            <TouchableOpacity style={styles.moreBtn} onPress={onMoreOptions}>
              <Text style={styles.moreText}>More options</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '78%',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 20,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#555',
    marginBottom: 10,
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 10 },
  search: {
    height: 42,
    borderRadius: 10,
    backgroundColor: '#252525',
    color: '#fff',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  loading: { paddingVertical: 24, alignItems: 'center' },
  listContent: { paddingBottom: 10 },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  userLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginRight: 10 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#333' },
  avatarFallback: { justifyContent: 'center', alignItems: 'center' },
  name: { color: '#fff', fontSize: 14, fontWeight: '600' },
  username: { color: '#b0b0b0', fontSize: 12, marginTop: 1 },
  sendBtn: {
    backgroundColor: '#3797EF',
    borderRadius: 8,
    minWidth: 68,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  sendBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  emptyText: { color: '#b0b0b0', fontSize: 13, textAlign: 'center', paddingVertical: 18 },
  moreBtn: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
  },
  moreText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
