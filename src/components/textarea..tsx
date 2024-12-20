import React, {useState} from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';

interface TextAreaProps {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  maxLength?: number;
  style?: object;
}

const TextArea: React.FC<TextAreaProps> = ({
  value = '',
  placeholder = 'Enter text...',
  onChangeText,
  maxLength = 200,
  style = {},
}) => {
  const [currentLength, setCurrentLength] = useState(value.length);

  const handleTextChange = (text: string) => {
    setCurrentLength(text.length);
    if (onChangeText) onChangeText(text);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={4}
        value={value}
        placeholder={placeholder}
        onChangeText={handleTextChange}
        maxLength={maxLength}
        textAlignVertical="top" // Ensures text starts at the top of the box
      />
      <Text style={styles.counter}>
        {currentLength}/{maxLength}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  textArea: {
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

export default TextArea;
