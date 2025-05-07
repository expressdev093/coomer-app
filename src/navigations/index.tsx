import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ApiDetailScreen,
  DetailScreen,
  HomeScreen,
  ModelSearch,
} from '../screens';
import {Text, TouchableOpacity, View} from 'react-native';
import {DrawerNavigation} from './drawer.navigation';
import {CreatorV2Detail} from '../screens/creatorsv2/creator-v2.detail';
import {ExportedModelDetailScreen} from '../screens/exported-models/exported-model-detail.screen';

const Stack = createNativeStackNavigator();

export const RootNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Drawer">
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigation}
        options={{
          headerTitle: 'Home',
          headerShown: false,
        }}
      />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="ApiDetail" component={ApiDetailScreen} />
      <Stack.Screen name="CreatorV2Detail" component={CreatorV2Detail} />
      <Stack.Screen name="ModelSearch" component={ModelSearch} />
      <Stack.Screen
        name="ExportedModelDetail"
        component={ExportedModelDetailScreen}
      />
    </Stack.Navigator>
  );
};
