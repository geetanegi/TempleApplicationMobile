import React from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

const Drawer = ({visible, onClose, children}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      swipeDirection="down"
      onSwipeComplete={onClose}>
      <View style={styles.container}>
        <View style={styles.handle} />
        {/* <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.comment}>
              <Text style={{fontWeight: 'bold'}}>{item.user}</Text>
              <Text>{item.text}</Text>
            </View>
          )}
          ListHeaderComponent={
            <View style={[st.justify_C, st.mt_B20]}>
              <Text style={[styles.title]}>{title}</Text>
            </View>
          }
        /> */}
        {children}
      </View>
    </Modal>
  );
};
export default Drawer;

// function Example() {
//   const [visible, setVisible] = useState(false);

//   const comments = [
//     {user: 'ravi_the_beardman', text: '🔥🔥🔥'},
//     {user: 'thakursingh9290', text: '❤️🔥🔥'},
//     {user: 'sourabh.tamrakar', text: '🔥🔥'},
//     {user: 'aniketnamdev', text: 'Hero Honda 🔥'},
//   ];

//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Button title="Open Comments" onPress={() => setVisible(true)} />
//       <Drawer
//         visible={visible}
//         title={'Comments'}
//         onClose={() => setVisible(false)}
//         data={comments}
//       />
//     </View>
//   );
// }

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '70%',
  },
  handle: {
    width: 60,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 10,
  },
  comment: {
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    marginHorizontal: 'auto',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
