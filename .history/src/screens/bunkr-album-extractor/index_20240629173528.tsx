import React, {useRef, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import SearchBar from 'react-native-search-bar';
import {BunkrAlbumHelper} from '../../helpers/bunkr-helper';

export const BunkrAlbumExtractorScreen = () => {
  const searchRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onHandleExtractAlbum = async (text: string) => {
    try {
      setLoading(true);
      const extractor = new BunkrAlbumHelper();

      const bunkrVideos = await extractor.fetchAll(text);
      await extractor.saveToFile(bunkrVideos.join('\n'), 'bunkr.txt');
      setLoading(false);
      Alert.alert('Split link traffice saved successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.message);
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <SearchBar
        text="https://bunkr.fi/a/O84V5e9k"
        ref={searchRef}
        placeholder="Enter Bunkr Album Url"
        onSearchButtonPress={onHandleExtractAlbum}
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
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
