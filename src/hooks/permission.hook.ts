import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';

export const useStoragePermissions = () => {
  const [hasStoragePermission, setHasStoragePermission] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const writePermission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.MEDIA_LIBRARY;

      const readPermission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.MEDIA_LIBRARY;

      const writeStatus = await check(writePermission);
      const readStatus = await check(readPermission);

      console.log('writeStatus', writeStatus);
      console.log('readStatus', readStatus);

      let writeResult = writeStatus;
      let readResult = readStatus;

      if (writeStatus !== RESULTS.GRANTED) {
        writeResult = await request(writePermission);
      }

      if (readStatus !== RESULTS.GRANTED) {
        readResult = await request(readPermission);
      }

      setHasStoragePermission(
        writeResult === RESULTS.GRANTED && readResult === RESULTS.GRANTED,
      );
    } catch (error) {
      console.error('Failed to request storage permissions', error);
      setHasStoragePermission(false);
    }
  };

  return {hasStoragePermission, requestPermissions};
};
