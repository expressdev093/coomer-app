import React, {useCallback, useEffect, useState} from 'react';
import {
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
import RNFS from 'react-native-fs';
import {ScrollView} from 'react-native-gesture-handler';
import {Constants} from '../../constants';

export const MergeFileScreen = () => {
  const [fileResponse, setFileResponse] = useState<DocumentPickerResponse[]>(
    [],
  );

  const handleDocumentSelection = useCallback(async () => {
    //readFile();
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
        mode: 'open',
      });
      setFileResponse(response);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  }, []);

  const getFilesContent = async (): Promise<string> => {
    try {
      const content = await Promise.all(
        fileResponse.map(async file =>
          (await RNFS.readFile(file.uri, 'utf8')).split('\n'),
        ),
      );
      const flatContent = content
        .flat()
        .filter(link => link.startsWith('https://'));
      return flatContent.join('\n');
      //console.log(JSON.stringify(flatContent, null, 2));
    } catch (err: any) {
      Alert.alert('Error', err.message);
      return '';
    }
  };

  const handleRemoveFile = (file: DocumentPickerResponse) => {
    setFileResponse(prev => prev.filter(f => f.name !== file.name));
  };

  //console.log(JSON.stringify(fileResponse, null, 2));
  const renderFileView = (file: DocumentPickerResponse) => {
    return (
      <View style={styles.fileView}>
        <Text>{file.name}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleRemoveFile(file)}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleSaveMergeFile = async () => {
    const modelName = getModelName();
    const fileName = `${modelName}.txt`;
    const dirctoryFolder = `${RNFS.DownloadDirectoryPath}/${Constants.directoryName}/${modelName}`;
    if (!(await RNFS.exists(dirctoryFolder))) {
      await RNFS.mkdir(dirctoryFolder);
    }

    const content = await getFilesContent();

    const path = `${dirctoryFolder}/${fileName}`;

    try {
      await RNFS.writeFile(path, content, 'utf8');

      Alert.alert('File merged and saved successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const getModelName = (): string => {
    if (fileResponse.length === 0) {
      return 'merge_coomer';
    }
    const name = fileResponse[0].name ?? '';
    const splitName = name.split('_');
    return `${splitName[0]}`;
  };

  const handleClearSelections = () => {
    setFileResponse([]);
  };

  const renderSelectFileButton = (
    <Button title="Select 📑" onPress={handleDocumentSelection} />
  );
  const renderclearButton = (
    <Button title="Clear 📑" onPress={handleClearSelections} />
  );

  return (
    <View style={styles.container}>
      {fileResponse.length > 0 ? renderclearButton : renderSelectFileButton}
      <View style={{height: 5}} />
      <Button title="Save Merge File 📑" onPress={handleSaveMergeFile} />
      <ScrollView style={{marginTop: 20}}>
        {fileResponse.map(renderFileView)}
      </ScrollView>
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
