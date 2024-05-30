import React, {useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import SearchBar from 'react-native-search-bar';
import {getUsername} from '../../helpers';
import {Model} from '../../typings';
import {useNavigation} from '@react-navigation/native';

export const ModelSearch = () => {
  const searchRef = useRef<any>(null);
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const onSearchButtonPress = async (text: string) => {
    try {
      setLoading(true);
      const username = await getUsername(text);
      setLoading(false);
      const model: Model = {
        id: username,
        image: '',
        name: username,
        provider: '',
        url: text,
        text: text,
      };
      navigation.navigate('Detail', {model});
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <SearchBar
        ref={searchRef}
        placeholder="Search"
        onSearchButtonPress={onSearchButtonPress}
        showsCancelButton={true}
        cancelButtonText="Cancel"
        showsCancelButtonWhileEditing
      />
      <View style={styles.content}>
        {loading && <ActivityIndicator size="large" />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
