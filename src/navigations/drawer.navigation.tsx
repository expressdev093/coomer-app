import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  AddBookmarkScreen,
  HomeScreen,
  MergeFileScreen,
  SplitUrlTrafficScreen,
} from '../screens';
import {CustomDrawerContent} from './components/drawer.content';
const Drawer = createDrawerNavigator();
export const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={CustomDrawerContent}>
      <Drawer.Screen name="Home" component={HomeScreen} />
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
    </Drawer.Navigator>
  );
};
