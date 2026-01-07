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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const {height: SCREEN_H} = Dimensions.get('window');

const AVATAR = 'https://randomuser.me/api/portraits/men/31.jpg';

const SHEET_HEIGHT = Math.round(SCREEN_H * 0.78); // tweak 0.72 - 0.85

const CommentScreen = ({visible, setVisible, comment}) => {
  const [input, setInput] = useState('');

  const data = useMemo(() => comment ?? [], [comment]);

  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SHEET_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, backdropOpacity, translateY]);

  const close = () => setVisible(false);

  const onSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // TODO: call API / update list
    setInput('');
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.row}>
        <Image style={styles.avatar} source={{uri: item?.avatar || AVATAR}} />

        <View style={styles.textBlock}>
          <View style={styles.titleRow}>
            <Text style={styles.nameText}>{item?.user ?? 'User'}</Text>
            <Text style={styles.timeText}>  •  19h</Text>
          </View>

          <Text style={styles.bodyText}>{item?.text ?? ''}</Text>

          <Pressable hitSlop={10} style={styles.replyBtn}>
            <Text style={styles.replyText}>Reply</Text>
          </Pressable>
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

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.sheetWrap,
          {
            transform: [{translateY}],
          },
        ]}>
        <LinearGradient
          colors={['#E9D3A3', '#F6F2E6', '#F6F2E6']}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={styles.sheet}>
          {/* handle */}
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>

          {/* title */}
          <Text style={styles.headerTitle}>Comments</Text>

          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
            <FlatList
              data={data}
              keyExtractor={(_, i) => String(i)}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />

            {/* Fixed input (like your reference) */}
            <View style={styles.inputDock}>
              <Image style={styles.meAvatar} source={{uri: AVATAR}} />

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
                  <FontAwesome name="send" size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </Animated.View>
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
