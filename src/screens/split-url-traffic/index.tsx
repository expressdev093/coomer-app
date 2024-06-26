import React, {useCallback, useState} from 'react';
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
import RNFS from 'react-native-fs';
import {Constants} from '../../constants';
import {CoomerApiHelper} from '../../helpers';

export const SplitUrlTrafficScreen = () => {
  const [fileResponse, setFileResponse] = useState<DocumentPickerResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const handleDocumentSelection = useCallback(async () => {
    //readFile();
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
        mode: 'open',
      });
      if (response.length > 0) {
        setFileResponse(response[0]);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  }, []);

  const getFilesContent = async (): Promise<string[]> => {
    try {
      if (fileResponse) {
        const text = await RNFS.readFile(fileResponse?.uri, 'utf8');
        const lines = text.split('\n');
        return lines;
      }
      return [];
    } catch (err: any) {
      Alert.alert('Error', err.message);
      return [];
    }
  };

  const handleRemoveFile = (file: DocumentPickerResponse) => {
    setFileResponse(undefined);
  };

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

  const handleSplitTraffic = async () => {
    const apiHelper = new CoomerApiHelper('');
    const folderName = getFolderName();
    const fileName = getFileName();
    const links = await getFilesContent();
    const splitTrafficeLinks = apiHelper.splitTrafficFordownloadLinks(links);
    try {
      setLoading(true);
      await apiHelper.splitTrafficeUrlSaveToFile(
        splitTrafficeLinks.join('\n'),
        folderName,
        fileName,
      );
      setLoading(false);
      Alert.alert('Split link traffice saved successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleClearSelections = () => {
    setFileResponse(undefined);
  };

  const getFileName = (): string => {
    return fileResponse?.name!;
  };

  const getFolderName = () => {
    let filename = fileResponse?.name ?? 'Cleaner (video).txt';
    let strs = filename.split(' ');

    return `${strs[0]} ${strs[1]}`;
  };

  const renderSelectFileButton = (
    <Button title="Select 📑" onPress={handleDocumentSelection} />
  );
  const renderclearButton = (
    <Button title="Clear 📑" onPress={handleClearSelections} />
  );

  console.log(fileResponse);

  return (
    <View style={styles.container}>
      {fileResponse !== undefined ? renderclearButton : renderSelectFileButton}
      <View style={{height: 5}} />
      {fileResponse &&
        (loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button
            disabled={loading}
            title="Split Traffic 📑"
            onPress={handleSplitTraffic}
          />
        ))}

      {fileResponse && renderFileView(fileResponse)}
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
