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
      <Stack.Screen name="ModelSearch" component={ModelSearch} />
    </Stack.Navigator>
  );
};
