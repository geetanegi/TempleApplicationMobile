import React, {useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Heart,
  MessageCircle,
  Send,
  MoreVertical,
  Trash2,
  Archive,
  Clock3,
} from 'lucide-react-native';
import Share from 'react-native-share';
import CommentScreen from '../../screens/dashboard/comment';

const ORANGE_1 = 'rgba(248,175,83,1)';
const ORANGE_2 = 'rgba(192,108,75,1)';

const PostCard = ({
  userName = 'Camila',
  location = 'Mexico City, Mexico',
  timeText = '55m',
  image,
  likes = 5400,
  comments = [],
  shares = 100,
  avatar,
  contentText = '',
  shareUrl, // optional: pass actual url from parent
  onDelete, // optional callbacks
  onArchive,
}) => {
  const {width: screenW, height: screenH} = useWindowDimensions();

  const [visible, setVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const menuBtnRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({top: 0, left: 0});
  const [expanded, setExpanded] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const likeCount = likes + (isLiked ? 1 : 0);
  const commentCount = comments?.length ?? 0;

  const shortText = useMemo(() => {
    if (!contentText) return '';
    if (contentText.length <= 90) return contentText;
    return contentText.slice(0, 90).trim();
  }, [contentText]);

  const handleLike = () => {
    setIsLiked(prev => !prev);

    Animated.spring(scaleAnim, {
      toValue: 1.12,
      useNativeDriver: true,
      friction: 4,
      tension: 140,
    }).start(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 120,
      }).start();
    });
  };

  const ActionPill = ({icon, count}) => {
    return (
      <LinearGradient
        colors={[ORANGE_1, ORANGE_2]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.pill}>
        {icon}
        <Text style={styles.pillText}>{count}</Text>
      </LinearGradient>
    );
  };

  const openMenuNextToButton = () => {
    // measure the 3-dots position and place menu near it
    menuBtnRef.current?.measureInWindow((x, y, w, h) => {
      const MENU_W = 150;
      const MENU_H = 110; // approx for 2 items
      const GAP = 8;

      // default: open below + align right edges
      let left = x + w - MENU_W;
      let top = y + h + GAP;

      // keep inside screen horizontally
      left = Math.max(12, Math.min(left, screenW - MENU_W - 12));

      // if going out of bottom, open above
      if (top + MENU_H > screenH - 12) {
        top = y - MENU_H - GAP;
      }

      setMenuPos({top, left});
      setMenuOpen(true);
    });
  };

  const share = async url => {
    try {
      const options = {
        title: 'Share',
        message: 'Check this out',
        url: url,
      };
      const res = await Share.open(options);
      console.log('Share result:', res);
    } catch (err) {
      // User cancelled share => ignore
      if (err?.message !== 'User did not share') {
        console.log('Share error:', err);
      }
    }
  };

  return (
    <>
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{uri: avatar || 'https://i.pravatar.cc/150?img=12'}}
              style={styles.avatar}
            />

            <View style={{flex: 1}}>
              <Text style={styles.userName} numberOfLines={1}>
                {userName}
              </Text>
              <Text style={styles.location} numberOfLines={1}>
                {location}
              </Text>

              <View style={styles.timeRow}>
                <Text style={styles.timeText}>{timeText}</Text>
                <Clock3 size={12} color="#777" style={{marginLeft: 6}} />
              </View>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* Follow button */}
            <Pressable>
              <LinearGradient
                colors={[ORANGE_1, ORANGE_2]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.followBtn}>
                <Text style={styles.followText}>Follow</Text>
              </LinearGradient>
            </Pressable>

            {/* Menu button (3 dots) */}
            <Pressable ref={menuBtnRef} hitSlop={12} onPress={openMenuNextToButton}>
              <MoreVertical size={20} color="#111" />
            </Pressable>
          </View>
        </View>

        {/* MENU DROPDOWN */}
        <Modal
          transparent
          visible={menuOpen}
          animationType="fade"
          onRequestClose={() => setMenuOpen(false)}>
          <Pressable
            style={styles.menuBackdrop}
            onPress={() => setMenuOpen(false)}
          />

          <View style={[styles.menuBox, {top: menuPos.top, left: menuPos.left}]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                onDelete?.();
              }}>
              <Trash2 size={16} color="#666" />
              <Text style={styles.menuText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                onArchive?.();
              }}>
              <Archive size={16} color="#666" />
              <Text style={styles.menuText}>Archive</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* CAPTION */}
        {!!contentText && (
          <Text style={styles.caption}>
            {expanded ? contentText : shortText}
            {contentText.length > 90 && (
              <Text style={styles.seeMore} onPress={() => setExpanded(p => !p)}>
                {expanded ? '  See less' : '... See more'}
              </Text>
            )}
          </Text>
        )}

        {/* IMAGE CARD */}
        {!!image && (
          <View style={styles.imageWrap}>
            <Image source={{uri: image}} style={styles.postImage} />
          </View>
        )}

        {/* ACTIONS */}
        <View style={styles.actionsRow}>
          <View style={styles.actionCol}>
            <Pressable onPress={handleLike}>
              <ActionPill
                count={formatCount(likeCount)}
                icon={
                  <Animated.View style={{transform: [{scale: scaleAnim}]}}>
                    <Heart
                      size={18}
                      color="#fff"
                      fill={isLiked ? '#fff' : 'transparent'}
                    />
                  </Animated.View>
                }
              />
            </Pressable>
          </View>

          <View style={styles.actionCol}>
            <Pressable onPress={() => setVisible(true)}>
              <ActionPill
                count={formatCount(commentCount)}
                icon={<MessageCircle size={18} color="#fff" />}
              />
            </Pressable>
          </View>

          <View style={styles.actionCol}>
            <Pressable onPress={() => share(shareUrl || 'https://example.com')}>
              <ActionPill
                count={formatCount(shares)}
                icon={<Send size={18} color="#fff" />}
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* COMMENTS */}
      <CommentScreen
        visible={visible}
        setVisible={setVisible}
        comment={comments}
      />
    </>
  );
};

export default PostCard;

// ---------- helpers ----------
function formatCount(n) {
  const num = Number(n || 0);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}m`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 26,
    padding: 16,
    marginVertical: 12,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 6},
    elevation: 2,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 999,
    marginRight: 12,
    backgroundColor: '#eee',
  },

  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
  },

  location: {
    fontSize: 13,
    color: '#7B7B7B',
    marginTop: 2,
    fontWeight: '600',
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  timeText: {
    fontSize: 12,
    color: '#111',
    fontWeight: '700',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  followBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },

  followText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },

  caption: {
    marginTop: 10,
    fontSize: 14,
    color: '#111',
    lineHeight: 20,
    fontWeight: '500',
  },

  seeMore: {
    color: '#666',
    fontWeight: '700',
  },

  imageWrap: {
    marginTop: 14,
    borderRadius: 28,
    overflow: 'hidden',
  },

  postImage: {
    width: '100%',
    height: 340,
    backgroundColor: '#eee',
  },

  actionsRow: {
    flexDirection: 'row',
    marginTop: 16,
    paddingHorizontal: 6,
    alignItems: 'center',
  },

  actionCol: {
    marginRight: 12,
  },

  pill: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  pillText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },

  // menu
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  menuBox: {
    position: 'absolute',
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 6,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 6},
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '700',
  },
});
