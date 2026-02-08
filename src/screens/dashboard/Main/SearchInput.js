import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors } from '../../../global/theme';

const SearchInput = ({
  value,
  onChangeText,
  placeholder = 'Search',
  style,
  editable = true,
  onPress,
}) => {
  const hasValue = (value || '').trim().length > 0;
  const showClear = editable && hasValue;

  const content = (
    <View style={[styles.container, style]}>
      <Search size={18} color={colors.DARK_BLACK} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={styles.input}
        editable={editable}
        pointerEvents={editable ? 'auto' : 'none'}
      />
      {showClear && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={10}
          style={styles.clearBtn}
        >
          <X size={18} color={colors.DARK_BLACK} />
        </Pressable>
      )}
    </View>
  );

  if (onPress && !editable) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
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
    paddingRight: 8,
  },
  clearBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchInput;
