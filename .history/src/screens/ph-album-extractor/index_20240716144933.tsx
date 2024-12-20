import React, {useRef, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import SearchBar from 'react-native-search-bar';
import {BunkrAlbumHelper} from '../../helpers/bunkr-helper';
import * as Progress from 'react-native-progress';
import {PhHelper} from '../../helpers/ph-helper/ph-helper';
import * as ph from './../../helpers/ph-helper/pornhub';

//video
//https://www.pornhub.com/view_video.php?viewkey=661d67fa9de4b

//https://www.pornhub.com/model/scott-stark

const videos: string[] = [
  'https://www.pornhub.com/view_video.php?viewkey=64732ce322846',
  'https://www.pornhub.com/view_video.php?viewkey=646a055acad91',
  'https://www.pornhub.com/view_video.php?viewkey=645f6fad6540c',
  'https://www.pornhub.com/view_video.php?viewkey=6457bc4cc14f9',
  'https://www.pornhub.com/view_video.php?viewkey=644afd1c2b624',
  'https://www.pornhub.com/view_video.php?viewkey=6445516f49b59',
  'https://www.pornhub.com/view_video.php?viewkey=643b910ff1aff',
  'https://www.pornhub.com/view_video.php?viewkey=643317a9a6463',
  'https://www.pornhub.com/view_video.php?viewkey=64260e8221166',
  'https://www.pornhub.com/view_video.php?viewkey=64190f0ea6409',
];

export const PhAlbumExtractorScreen = () => {
  const searchRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const onHandleExtractAlbum = async (text: string) => {
    ph.details(
      'http://www.pornhub.com/view_video.php?viewkey=591533139',
      function (err: any, details: any) {
        console.log(err, details);
      },
    );

    // const links: string[] = [];
    //const phHelper = new PhHelper();
    // const phVideos = await phHelper.getVideosDetail(videos);
    // await phHelper.getPageVideos(links, text);
    // //const links = phHelper.getVideoLinks();
    //console.log(JSON.stringify(phVideos, null, 2));
    // console.log(links.length);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        text="https://www.pornhub.com/view_video.php?viewkey=ph6149e9751240f"
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
