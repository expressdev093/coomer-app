import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Switch, SwitchChangeEvent, Text, View} from 'react-native';
import * as ScopedStorage from 'react-native-scoped-storage';
import {Storage} from '../../helpers';

type Props = DrawerContentComponentProps;

export const CustomDrawerContent: React.FC<Props> = props => {
  const [isChecked, setChecked] = useState<boolean>(false);
  const handleSetStorageDir = async () => {
    let dir = await ScopedStorage.openDocumentTree(true);
    await Storage.setDirectory(dir);
  };

  const handleImageSwitch = async (value: boolean) => {
    await Storage.setImageShow(value);
    setChecked(value);
  };

  useEffect(() => {
    (async () => {
      setChecked(await Storage.isImageShow());
    })();
  }, []);
  return (
    <DrawerContentScrollView>
      <DrawerItemList {...props} />
      <DrawerItem label="Storage Folder" onPress={handleSetStorageDir} />
      <View style={styles.switchItem}>
        <Text style={styles.switchItemLabel}>Show/Hide Image</Text>
        <Switch onValueChange={handleImageSwitch} value={isChecked} />
      </View>
    </DrawerContentScrollView>
  );
};
const styles = StyleSheet.create({
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingLeft: 20,
  },
  switchItemLabel: {
    fontWeight: 'bold',
  },
});
