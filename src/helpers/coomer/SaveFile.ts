import {Constants} from '../../constants';
import {SaveFileDto} from '../../typings/typings.v2';
import RNFS from 'react-native-fs';
import * as ScopedStorage from 'react-native-scoped-storage';

export class SaveFile {
  save = async (fileInfo: SaveFileDto) => {
    //const fileName = `${model.name} ${model.provider} (${length} ${type}).txt`;
    const dirctoryFolder = `${RNFS.DownloadDirectoryPath}/${Constants.directoryName}/${fileInfo.folderPath}`;

    const dirExist = await RNFS.exists(dirctoryFolder);
    if (!dirExist) {
      await RNFS.mkdir(dirctoryFolder);
      // await RNFS.unlink(dirctoryFolder);
      // console.log(`Directory ${dirctoryFolder} removed`);
    }

    const path = `${dirctoryFolder}/${fileInfo.fileName}`;

    const fileExist = await RNFS.exists(path);
    if (fileExist) {
      await ScopedStorage.deleteFile(path);
    }

    await RNFS.writeFile(path, fileInfo.content, 'utf8');
  };
}
