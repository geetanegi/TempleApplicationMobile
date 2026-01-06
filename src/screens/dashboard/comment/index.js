import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Drawer from '../../../components/CustomDrawer';
import st from '../../../global/styles';
import { colors } from '../../../global/theme';

const { width } = Dimensions.get('window');

const AVATAR =
  'https://randomuser.me/api/portraits/men/31.jpg';

const CommentScreen = ({ visible, setVisible, comment }) => {
  const [input, setInput] = useState('');

  const data = useMemo(() => comment ?? [], [comment]);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.row}>
        <Image style={styles.avatar} source={{ uri: AVATAR }} />

        <View style={styles.textBlock}>
          <View style={styles.titleRow}>
            <Text style={styles.nameText}>{item?.user ?? 'User'}</Text>
            <Text style={styles.timeText}> 19h</Text>
          </View>

          <Text style={styles.bodyText}>{item?.text ?? ''}</Text>

          <Pressable hitSlop={10} style={styles.replyBtn}>
            <Text style={styles.replyText}>Reply</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const onSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // TODO: hook your API / add to state
    // Example: add locally / call parent callback
    setInput('');
  };

  return (
    <Drawer visible={visible} title={'Comments'} onClose={() => setVisible(false)}>
      <LinearGradient
        colors={['#E9D3A3', '#F6F2E6', '#F6F2E6']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.sheet}
      >
        {/* small handle like figma */}
        <View style={styles.handleWrap}>
          <View style={styles.handle} />
        </View>

        <Text style={styles.headerTitle}>Comments</Text>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <FlatList
            data={data}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Fixed input like figma */}
          <View style={styles.inputDock}>
            <Image style={styles.meAvatar} source={{ uri: AVATAR }} />

            <View style={styles.inputPill}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Add a comment"
                placeholderTextColor="#8E8E8E"
                style={styles.input}
                returnKeyType="send"
                onSubmitEditing={onSend}
              />

              <Pressable onPress={onSend} hitSlop={10} style={styles.actionBtn}>
                {/* you can swap this icon to match your figma */}
                <FontAwesome name="send" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Drawer>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },

  sheet: {
    flex: 1,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
    paddingBottom: 8,
  },

  handleWrap: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 6,
  },
  handle: {
    width: 70,
    height: 5,
    borderRadius: 99,
    backgroundColor: '#111',
    opacity: 0.6,
  },

  headerTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    paddingVertical: 10,
  },

  listContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 90, // IMPORTANT: so list doesn't hide behind input
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

  nameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  timeText: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '500',
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
    fontWeight: '600',
  },

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
    backgroundColor: 'rgba(240,240,240,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },

  meAvatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#DDD',
  },

  inputPill: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#EDEDED',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.18)',
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
