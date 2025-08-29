import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
import React from 'react';
import Drawer from '../../../components/CustomDrawer';
import st from '../../../global/styles';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

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
          <View style={[styles.comment, st.justify_Row, st.align_C]}>
            <View>
              <Image
                style={styles.avatar}
                source={{
                  uri: 'https://randomuser.me/api/portraits/men/31.jpg',
                }}
              />
            </View>
            <View style={[st.wdh100]}>
              <View style={[st.justify_Row, st.wdh100, st.align_C]}>
                <Text style={[st.tx12, st.txColor]}>{item.user}</Text>
                <Text style={[st.tx10, st.txtlight]}> 19h</Text>
              </View>
              <View style={[st.justify_Row, styles.commentContainer]}>
                <Text style={[st.tx14]}>{item.text}</Text>
                <EvilIcons name="heart" color="#000" size={24} />
              </View>
              <View style={[st.justify_Row, styles.commentContainer]}>
                <Text style={[st.tx12, st.txtlight]}>Reply</Text>
              </View>
            </View>
          </View>
        )}
        ListHeaderComponent={
          <View style={[st.justify_C, st.mt_B20]}>
            <Text style={[styles.title]}>{'Comments'}</Text>
          </View>
        }
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
});
