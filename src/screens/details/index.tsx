/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Page} from '../../typings';
import {generatePages} from '../../helpers';
import {PageListItem} from './components/page-list.item';
import {useDirectory} from '../../hooks';

export const DetailScreen = () => {
  const navigation = useNavigation();
  const [size, setSize] = useState<string>();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    params: {model},
  } = useRoute<any>();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: model.name,
    });
  }, [navigation, model]);

  useEffect(() => {
    loadPages();
  }, [model]);

  const {filesLoading, directoryFiles, addFileInDirectory} =
    useDirectory(model);

  const loadPages = async () => {
    try {
      setLoading(true);
      const [max, localPages] = await generatePages(model);
      setLoading(false);
      setSize(max);
      setPages(localPages);
    } catch (err: any) {
      setLoading(false);
      console.log(err);
      Alert.alert('Error', err.message);
    }
  };

  const renderLoading = <ActivityIndicator size="large" />;
  const renderPagesList = (
    <FlatList
      data={pages}
      keyExtractor={(item, index) => `${index}`}
      renderItem={({item}) => (
        <PageListItem
          page={item}
          addFileInDirectory={addFileInDirectory}
          file={directoryFiles.find(f => f.name === item.fileName)}
        />
      )}
    />
  );

  return (
    <View style={styles.container}>
      {loading ? renderLoading : renderPagesList}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
