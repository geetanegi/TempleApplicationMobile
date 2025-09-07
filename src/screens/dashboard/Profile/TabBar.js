import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const TabBar = ({tabs, activeTab, setActiveTab}) => (
  <View style={styles.tabBar}>
    {tabs.map(tab => (
      <TouchableOpacity
        key={tab}
        style={styles.tabItem}
        onPress={() => setActiveTab(tab)}>
        <Text
          style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
          {tab}
        </Text>
        {activeTab === tab && <View style={styles.indicator} />}
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: 'gray',
  },
  activeTabText: {
    color: 'black',
    fontWeight: '500',
  },
  indicator: {
    marginTop: 5,
    height: 2,
    width: '100%',
    backgroundColor: 'orange',
    borderRadius: 2,
  },
});

export default TabBar;
