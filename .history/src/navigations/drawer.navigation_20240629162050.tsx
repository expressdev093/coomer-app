import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  AddBookmarkScreen,
  BunkrAlbumExtractorScreen,
  CreatorsScreen,
  HomeScreen,
  MergeFileScreen,
  SplitUrlTrafficScreen,
  SyncExportedModelScreen,
} from '../screens';
import {CustomDrawerContent} from './components/drawer.content';
const Drawer = createDrawerNavigator();
export const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={CustomDrawerContent}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Creators" component={CreatorsScreen} />
      <Drawer.Screen
        name="BunkrAlbumExtractor"
        component={BunkrAlbumExtractorScreen}
        options={{
          headerTitle: 'Bunkr Album Extractor',
        }}
      />
      <Drawer.Screen name="MergeFile" component={MergeFileScreen} />
      <Drawer.Screen name="AddBookmarks" component={AddBookmarkScreen} />
      <Drawer.Screen
        name="UrlCleaner"
        options={{
          headerTitle: 'Split Url Traffic',
          drawerLabel: 'Split Url Traffic',
        }}
        component={SplitUrlTrafficScreen}
      />
      <Drawer.Screen
        name="SyncExportedModel"
        options={{
          headerTitle: 'Sync Exported Models',
          drawerLabel: 'Sync Exported Models',
        }}
        component={SyncExportedModelScreen}
      />
    </Drawer.Navigator>
  );
};
