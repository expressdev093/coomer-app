import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import * as ScopedStorage from 'react-native-scoped-storage';

import {ScrollView} from 'react-native-gesture-handler';
import {Constants} from '../../constants';
import {getBookmarkJson} from '../../helpers/bookmark.helper';
import {Category, Model} from '../../typings';
import {
  Storage,
  getCategorySelectLabelAndValue,
  makeBookmarkFlat,
  removeOtherLinksAndEmptyCategory,
} from '../../helpers';

export const AddBookmarkScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileResponse, setFileResponse] = useState<DocumentPickerResponse>();

  const handleDocumentSelection = useCallback(async () => {
    //readFile();
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        mode: 'open',
      });
      if (response.length > 0) {
        setFileResponse(response[0]);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  }, []);

  //console.log(JSON.stringify(fileResponse, null, 2));

  const handleSaveBookmarkJson = async () => {
    try {
      setLoading(true);
      const categories: Category[] = await getBookmarkJson(fileResponse);
      const selectCategoriesOptions = getCategorySelectLabelAndValue(
        removeOtherLinksAndEmptyCategory(categories),
      );

      const models = makeBookmarkFlat(categories);

      await Storage.setBookmark(models);
      await Storage.setCategories(selectCategoriesOptions);
      setLoading(false);
      Alert.alert('Bookmark Added', 'Bookmark added successfully');
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err.message);
    }
  };

  const renderSelectFileButton = (
    <Button title="Select 📑" onPress={handleDocumentSelection} />
  );

  return (
    <View style={styles.container}>
      {renderSelectFileButton}
      <View style={{height: 5}} />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Save Json 📑" onPress={handleSaveBookmarkJson} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  fileView: {
    borderWidth: 1,
    borderStyle: 'solid',
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    borderLeftWidth: 1,
    paddingLeft: 10,
  },
});
