import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors } from '../../../global/theme';

const SearchInput = ({
  value,
  onChangeText,
  placeholder = 'Search',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Search size={18} color={colors.DARK_BLACK} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 30, // ✅ REQUIRED
    borderWidth: 1,
    borderColor: '#1f2937',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#111827',
  },
});

export default SearchInput;
