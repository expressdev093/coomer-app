import React, {useState} from 'react';
import {Page} from '../../../typings';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  View,
} from 'react-native';
import {useDirectory, useStoragePermissions} from '../../../hooks';
import RNFS from 'react-native-fs';
import {formatFileSize, scrapPages} from '../../../helpers';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Constants} from '../../../constants';
import * as ScopedStorage from 'react-native-scoped-storage';

type Props = {
  page: Page;
  file?: ScopedStorage.FileType;
  addFileInDirectory: (files: ScopedStorage.FileType) => void;
};

export const PageListItem: React.FC<Props> = ({
  page,
  file,
  addFileInDirectory,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  // const {hasStoragePermission, requestPermissions} = useStoragePermissions();

  const loadLinks = async () => {
    try {
      setLoading(true);
      const videoLinks = await scrapPages([page.pageLink]);
      const formattedLinks = videoLinks.links.join('\n');
      setLoading(false);
      saveToFile(formattedLinks);
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error while getting page links', err.message);
    }
  };

  const saveToFile = async (data: string) => {
    const fileName = page.fileName;
    const dirctoryFolder = `${RNFS.DownloadDirectoryPath}/${Constants.directoryName}/${page.model.name}`;
    if (!(await RNFS.exists(dirctoryFolder))) {
      await RNFS.mkdir(dirctoryFolder);
    }

    const path = `${dirctoryFolder}/${fileName}`;

    try {
      await RNFS.writeFile(path, data, 'utf8');
      addFileInDirectory({
        ctime: new Date(),
        mtime: new Date(),
        name: `${fileName}`,
        path: `${RNFS.DownloadDirectoryPath}/coomer/${page.model.name}/${fileName}`,
        size: 0,
      } as any);
      Alert.alert('File created and saved successfully!');
    } catch (err) {
      console.log(err);
    }
  };

  const renderLoading = <ActivityIndicator size={'large'} />;
  const renderTitle = (
    <View style={style.titleView}>
      <View style={{flex: 1}}>
        <Text>Download Page {page.title}</Text>
        {file && (
          <Text style={style.size}>
            Size {formatFileSize((file as any).size)}
          </Text>
        )}
      </View>
      {file && <AntDesign name="checkcircle" size={24} color="green" />}
    </View>
  );

  console.log(file);
  return (
    <TouchableOpacity
      disabled={file !== undefined}
      style={style.container}
      onPress={loadLinks}>
      {loading ? renderLoading : renderTitle}
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  container: {
    elevation: 3,
    backgroundColor: '#fff',
    paddingVertical: 10,

    paddingHorizontal: 10,
    width: Dimensions.get('screen').width,
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  size: {},
});
