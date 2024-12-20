import React, {useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SearchBar from 'react-native-search-bar';

export const BunkrAlbumExtractorScreen = () => {
  const searchRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onHandleExtractAlbum = async (text: string) => {};
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
