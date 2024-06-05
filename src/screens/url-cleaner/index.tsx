import React, {useCallback, useState} from 'react';
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
import RNFS from 'react-native-fs';
import {Constants} from '../../constants';

export const UrlCleanerScreen = () => {
  const [fileResponse, setFileResponse] = useState<DocumentPickerResponse>();

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

  const getFilesContent = async (): Promise<string> => {
    try {
      if (fileResponse) {
        const text = await RNFS.readFile(fileResponse?.uri, 'utf8');
        const lines = text.split('\n');
        // const cleanedLines = lines.map(line =>
        //   line.replace(/[\r\t]+/g, '').trim(),
        // ); //lines.map(line => line.trim());
        // const nonEmptyLines = cleanedLines.filter(line => line.length > 0);

        //.join('\n');

        console.log('All', lines.length);
        console.log(JSON.stringify(lines, null, 2));

        // console.log('Cleaned', nonEmptyLines.length);
        // console.log(JSON.stringify(nonEmptyLines, null, 2));
        // console.log(
        //   JSON.stringify(
        //     content.filter(url => !url.startsWith('https://')),
        //     null,
        //     2,
        //   ),
        // );

        return lines.join('\n');
      }
      return '';
    } catch (err: any) {
      Alert.alert('Error', err.message);
      return '';
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

  const handleCleanFile = async () => {
    const folderName = getFolderName();
    const fileName = getFileName();

    getFilesContent();
    // const dirctoryFolder = `${RNFS.DownloadDirectoryPath}/${Constants.directoryName}/${folderName}`;
    // if (!(await RNFS.exists(dirctoryFolder))) {
    //   await RNFS.mkdir(dirctoryFolder);
    // }
    // const content = await getFilesContent();
    // const path = `${dirctoryFolder}/${fileName}`;
    // const fileExists = await RNFS.exists(path);
    // if (fileExists) {
    //   // If file exists, remove it first

    //   await RNFS.unlink(path);
    // }
    // try {
    //   await RNFS.writeFile(path, content, 'utf8');
    //   Alert.alert('File Cleaned and saved successfully!');
    // } catch (err: any) {
    //   Alert.alert('Error', err.message);
    // }
  };

  const handleClearSelections = () => {
    setFileResponse(undefined);
  };

  const getFileName = (): string => {
    return fileResponse?.name!;
  };

  const getFolderName = () => {
    let filename = fileResponse?.name ?? 'Cleaner (video).txt';
    let index = filename.indexOf('(video).txt');
    let result = filename.substring(0, index).trim();
    return result;
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
      {fileResponse && (
        <Button title="Clean File 📑" onPress={handleCleanFile} />
      )}

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
