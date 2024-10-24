import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SearchBar from 'react-native-search-bar';
import {BunkrAlbumHelper} from '../../helpers/bunkr-helper';
import * as Progress from 'react-native-progress';

export const BunkrAlbumExtractorScreen = () => {
  const searchRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [urlLogs, setUrlLogs] = useState<string[]>([]);

  const onHandleExtractAlbum = async (text: string) => {
    try {
      setUrlLogs([]);
      setProgress(0);
      setLoading(true);
      const extractor = new BunkrAlbumHelper();

      const bunkrAlbum = await extractor.fetchAll(
        text,
        setProgress,
        urlLogCallback,
      );
      await extractor.saveToFile(
        bunkrAlbum.urls.join('\n'),
        `${bunkrAlbum.title} - ${bunkrAlbum.info}.txt`,
      );
      setLoading(false);
      Alert.alert('Split link traffice saved successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.message);
      setLoading(false);
    }
  };

  const urlLogCallback = (url: string) => {
    setUrlLogs(prev => [...prev, url]);
  };
  console.log(urlLogs);

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
      <View style={{height: 100}}>
        {loading && (
          <View style={styles.content}>
            <ActivityIndicator size="large" />
            <Progress.Bar progress={progress / 100} width={200} />
          </View>
        )}
      </View>
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          {urlLogs.map((url, index) => (
            <View key={index}>
              <Text>{url}</Text>
            </View>
          ))}
        </ScrollView>
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
