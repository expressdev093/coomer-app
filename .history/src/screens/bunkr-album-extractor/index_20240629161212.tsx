import React, {useRef, useState} from 'react';
import {Text, View} from 'react-native';

export const BunkrAlbumExtractorScreen = () => {
  const searchRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <View>
      <Text>BunkrAlbumExtractorScreen</Text>
    </View>
  );
};
