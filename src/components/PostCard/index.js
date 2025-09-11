import React from 'react';
import {View, Text, StyleSheet, Image, Pressable, FlatList} from 'react-native';
import {Heart, MessageCircle, Send, MoreHorizontal} from 'lucide-react-native';
import {colors} from '../../global/theme';
import st from '../../global/styles';
import Drawer from '../CustomDrawer';
import CommentScreen from '../../screens/dashboard/comment';
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('screen');
const PostCard = ({
  userName,
  location,
  image,
  likes,
  comments,
  shares,
  avatar,
  contentText,
  index,
}) => {
  const [visible, setVisible] = React.useState(false);
  const comment = [
    {user: 'ravi_the_beardman', text: '🔥🔥🔥'},
    {user: 'thakursingh9290', text: '❤️🔥🔥'},
    {user: 'sourabh.tamrakar', text: '🔥🔥'},
    {user: 'aniketnamdev', text: 'Hero Honda 🔥'},
  ];
  return (
    <View style={[styles.card]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{uri: avatar}} // mock user avatar
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>
        <MoreHorizontal size={20} color="#333" />
      </View>

      {/* Post Image */}
      <Image source={{uri: image}} style={styles.postImage} />

      {/* Footer */}

      <View style={styles.footer}>
        <View style={styles.actions}>
          <View style={styles.actionRow}>
            <Heart size={20} color={colors.orange} />
            <Text style={styles.actionText}>{likes}</Text>
          </View>
          <Pressable onPress={() => setVisible(true)} style={styles.actionRow}>
            {/* Comment Drawer */}
            <CommentScreen
              visible={visible}
              setVisible={setVisible}
              comment={comment}
            />
            <MessageCircle size={20} color={colors.orange} />
            <Text style={styles.actionText}>{comments}</Text>
          </Pressable>
          <Pressable style={styles.actionRow}>
            <Send size={20} color={colors.orange} />
            <Text style={styles.actionText}>{shares}</Text>
          </Pressable>
        </View>
      </View>
      <View style={[st.pv10]}>
        <Text style={[st.tx14]}>{contentText}</Text>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.orange,
    height: height / 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  userName: {
    fontWeight: '800',
    fontSize: 14,
    color: colors.black,
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  postImage: {
    width: '100%',
    height: 280,
    borderRadius: 10,
    marginVertical: 8,
  },
  footer: {
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  comment: {
    gap: 8,
  },
  title: {
    textAlign: 'center',
    marginHorizontal: 'auto',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
