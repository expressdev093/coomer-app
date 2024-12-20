import React from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';

interface StyledTextInputProps {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  maxLength?: number;
  style?: object;
}

const StyledTextInput: React.FC<StyledTextInputProps> = ({
  value = '',
  placeholder = 'Enter text...',
  onChangeText,
  maxLength,
  style = {},
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        maxLength={maxLength}
      />
      {maxLength && (
        <Text style={styles.counter}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  counter: {
    textAlign: 'right',
    marginTop: 5,
    fontSize: 12,
    color: '#888',
  },
});

export default StyledTextInput;
