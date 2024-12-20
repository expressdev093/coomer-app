import {useEffect, useState} from 'react';
import {Model, Page} from '../typings';
import RNFS from 'react-native-fs';
import {Alert} from 'react-native';
import {Constants} from '../constants';
import {Storage} from '../helpers';
import * as ScopedStorage from 'react-native-scoped-storage';
import {useAppDispatch} from '../store';
import {ExportedModelActions} from '../store/slices';

export const useReadDirectoryFolders = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [importedModelsList, setImportedModelList] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const syncExportedModels = async () => {
    try {
      setLoading(true);

      const dir = `${RNFS.DownloadDirectoryPath}/${Constants.directoryName}`;

      const listFiles = await RNFS.readDir(dir);

      const folders = listFiles
        .filter(f => f.isDirectory())
        .map(f => getDirName(f));
      setImportedModelList(folders);
      dispatch(ExportedModelActions.addBulk(folders));
      setLoading(false);
    } catch (err: any) {
      console.log('Error reading directory:', err);
      setLoading(false);
      Alert.alert('Error reading directory:', err.message);
    }
  };

  const getDirName = (file: RNFS.ReadDirItem): string => {
    const strs = file.name.split(' ');

    return strs[0];
  };
  return {
    syncExportedModels,
    loading,
    importedModelsList,
  };
};
