import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  Touchable,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import React from 'react';
import Drawer from '../../../components/CustomDrawer';
import st from '../../../global/styles';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import InputText from '../../../components/InputText';
import {colors} from '../../../global/theme';

const CommentScreen = ({visible, setVisible, comment}) => {
  return (
    <Drawer
      visible={visible}
      title={'Comments'}
      onClose={() => setVisible(false)}>
      <FlatList
        data={comment}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={[styles.comment, st.justify_Row, st.align_S, st.pv6]}>
            <View>
              <Image
                style={styles.avatar}
                source={{
                  uri: 'https://randomuser.me/api/portraits/men/31.jpg',
                }}
              />
            </View>

            <View>
              <View style={[st.justify_Row, st.wdh100, st.align_C]}>
                <Text style={[st.tx12, st.txColor]}>{item.user}</Text>
                <Text style={[st.tx10, st.txtlight]}> 19h</Text>
              </View>
              <View style={[st.justify_Row, styles.commentContainer]}>
                <Text style={[st.tx14]}>{item.text}</Text>
              </View>

              <Pressable style={[st.justify_Row, styles.commentContainer]}>
                <Text style={[st.tx12, st.txtlight]}>Reply</Text>
              </Pressable>
              <Pressable
                style={[st.justify_Row, styles.commentContainer, st.wdh100]}>
                <Text style={[st.tx12, st.txtlight, st.txAlignC, st.pd_H40]}>
                  View more reply
                </Text>
              </Pressable>
            </View>
            <View style={[st.align_C, st.wdh10, {marginLeft: 'auto'}, st.gap2]}>
              <EvilIcons name="heart" color="#000" size={24} />
              <Text style={[st.tx12]}>1</Text>
            </View>
          </View>
        )}
        ListHeaderComponent={
          <View style={[st.justify_C, st.mt_B20]}>
            <Text style={[styles.title]}>{'Comments'}</Text>
          </View>
        }
        ListFooterComponent={<InputReply />}
      />
    </Drawer>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 56,
    marginRight: 8,
  },
  comment: {
    marginBottom: 12,
    gap: 8,
    maxHeight: 'min-content',
    paddingVertical: 2,
  },
  title: {
    textAlign: 'center',
    marginHorizontal: 'auto',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  commentContainer: {
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  inputbtn: {
    width: 50,
    borderColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.6,
    borderRadius: 2,
    backgroundColor: 'rgba(253, 124, 32, 0.8)',
  },
  inputBox: {
    width: Dimensions.get('window').width - 100,
    borderWidth: 0.2,
    borderRadius: 2,
    padding: 10,
  },
});

const InputReply = () => {
  return (
    <View style={[st.justify_Row, st.gap2, st.pv10, st.justify_C]}>
      <TextInput
        style={styles.inputBox}
        placeholder="What do you think of this?"
      />
      <TouchableOpacity style={styles.inputbtn}>
        <FontAwesome name="send-o" color="#000000" />
      </TouchableOpacity>
    </View>
  );
};
