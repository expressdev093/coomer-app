import React, {useRef, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import SearchBar from 'react-native-search-bar';
import {BunkrAlbumHelper} from '../../helpers/bunkr-helper';
import * as Progress from 'react-native-progress';

export const BunkrAlbumExtractorScreen = () => {
  const searchRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const onHandleExtractAlbum = async (text: string) => {
    try {
      setProgress(0);
      setLoading(true);
      const extractor = new BunkrAlbumHelper();
      await extractor.parseVideoUrl(text);

      // const bunkrAlbum = await extractor.fetchAll(text, setProgress);
      // await extractor.saveToFile(
      //   bunkrAlbum.urls.join('\n'),
      //   `${bunkrAlbum.title} - ${bunkrAlbum.info}.txt`,
      // );
      // setLoading(false);
      // Alert.alert('Split link traffice saved successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar
        text="https://get.bunkrr.su/file/34178592"
        ref={searchRef}
        placeholder="Enter Bunkr Album Url"
        onSearchButtonPress={onHandleExtractAlbum}
        showsCancelButton={true}
        cancelButtonText="Cancel"
        showsCancelButtonWhileEditing
      />
      {loading && (
        <View style={styles.content}>
          <ActivityIndicator size="large" />
          <Progress.Bar progress={progress / 100} width={200} />
        </View>
      )}
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
