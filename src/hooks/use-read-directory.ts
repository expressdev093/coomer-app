import {useEffect, useState} from 'react';
import {DirectoryModel, Model, Page} from '../typings';
import RNFS from 'react-native-fs';
import {Alert} from 'react-native';
import {Constants} from '../constants';
import {Storage} from '../helpers';
import * as ScopedStorage from 'react-native-scoped-storage';
import {useAppDispatch, useAppSelector} from '../store';
import {ExportedModelActions} from '../store/slices';

export const useReadDirectoryFolders = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [importedModelsList, setImportedModelList] = useState<string[]>([]);
  const {dataSource} = useAppSelector(state => state.creators);
  const dispatch = useAppDispatch();

  const syncExportedModels = async () => {
    try {
      setLoading(true);

      const folders = await readFoldersWithModels();
      const modelsToSync: any[] = folders
        .map(folder =>
          folder.models
            .filter(m => m.name)
            .map(model => ({
              name: model.name.split(' ')[0],
              category: folder.name,
            }))
            .map(dModel => ({
              ...dataSource.find(model => model.name === dModel.name),
              category: dModel.category,
            })),
        )
        .flat();
      dispatch(ExportedModelActions.addBulkModels(modelsToSync));
      setLoading(false);
    } catch (err: any) {
      console.log('Error reading directory:', err);
      setLoading(false);
      Alert.alert('Error reading directory:', err.message);
    }
  };

  const readFoldersWithModels = async () => {
    const dir = `${RNFS.DownloadDirectoryPath}/${Constants.directoryName}`;

    try {
      const listFiles = await RNFS.readDir(dir);

      const folders = await Promise.all(
        listFiles
          .filter(item => item.name)
          .filter(item => item.isDirectory())
          .map(async folder => ({
            ...folder,
            models: await RNFS.readDir(folder.path),
          })),
      );

      return folders;
    } catch (error) {
      console.error('Error reading folders:', error);
      return [];
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
