import {useEffect, useState} from 'react';
import {Model, Page} from '../typings';
import RNFS from 'react-native-fs';
import {Alert} from 'react-native';
import {Constants} from '../constants';
import {Storage} from '../helpers';
import * as ScopedStorage from 'react-native-scoped-storage';

export const useDirectory = (model: Model) => {
  const [directoryFiles, setDirectoryFiles] = useState<
    ScopedStorage.FileType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadFiles();
  }, [model]);

  const loadFiles = async () => {
    try {
      const dir = await Storage.getDirectory();
      const dirctoryFolder = `${dir.uri}/${model.name}`;
      const listFiles = await ScopedStorage.listFiles(dirctoryFolder);
      const modelDir = listFiles.find(f => f.name === model.name);

      if (modelDir) {
        setLoading(true);
        const files = await ScopedStorage.listFiles(modelDir.uri);

        setDirectoryFiles(files);
        setLoading(false);
      }
    } catch (err: any) {
      console.log('Error reading directory:', err);
      setLoading(false);
      Alert.alert('Error reading directory:', err.message);
    }
  };

  console.log(JSON.stringify(directoryFiles, null, 2));

  const isFolderExists = async (path: string) => await RNFS.exists(path);

  const addFileInDirectory = (file: ScopedStorage.FileType) => {
    if (directoryFiles) {
      const newFiles = [...directoryFiles, file];
      setDirectoryFiles(newFiles);
    } else {
      setDirectoryFiles([file]);
    }
  };

  return {
    filesLoading: loading,
    directoryFiles,
    setDirectoryFiles,
    addFileInDirectory,
  };
};
