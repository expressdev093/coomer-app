import React, {useRef, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import SearchBar from 'react-native-search-bar';
import {BunkrAlbumHelper} from '../../helpers/bunkr-helper';
import * as Progress from 'react-native-progress';
import {PhHelper} from '../../helpers/ph-helper/ph-helper';

//video
//https://www.pornhub.com/view_video.php?viewkey=661d67fa9de4b

//https://www.pornhub.com/model/scott-stark

export const PhAlbumExtractorScreen = () => {
  const searchRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const onHandleExtractAlbum = async (text: string) => {
    const phHelper = new PhHelper();
    await phHelper.getPageVideos(text);
    const links = phHelper.getVideoLinks();
    console.log(JSON.stringify(links, null, 2));
  };

  return (
    <View style={styles.container}>
      <SearchBar
        text="https://www.pornhub.com/model/scott-stark/videos"
        ref={searchRef}
        placeholder="Enter Ph Album Url"
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
