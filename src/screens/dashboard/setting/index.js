import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You can change icon set
import {colors} from '../../../global/theme';
import {useNavigation} from '@react-navigation/native';
import SecondaryHeader from '../../../components/Header/secondaryHeader';

const SettingItem = ({icon, label, onPress}) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Icon name={icon} size={20} color={colors.white} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Icon
        name="chevron-right"
        size={22}
        color={colors.DARK_GREY}
        style={styles.arrow}
      />
    </TouchableOpacity>
  );
};

// ✅ Settings Screen
const SettingsScreen = () => {
  const settingsOptions = [
    {id: '1', label: 'Account', icon: 'person'},
    {id: '2', label: 'Support', icon: 'headset-mic'},
    {id: '3', label: 'Privacy Policy', icon: 'lock'},
    {id: '4', label: 'Terms & Condition', icon: 'gavel'},
    {id: '5', label: 'Configuration', icon: 'settings'},
  ];

  return (
    <View style={styles.container}>
      <SecondaryHeader title={'Settings'} />

      <FlatList
        data={settingsOptions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <SettingItem
            icon={item.icon}
            label={item.label}
            onPress={() => console.log(item.label + ' pressed')}
          />
        )}
      />
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 24,
    color: colors.DARK_BLACK,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f77f00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  arrow: {
    marginLeft: 10,
  },
});

export default SettingsScreen;
