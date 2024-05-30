import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {RootNavigation} from './src/navigations';
export const App = () => {
  return (
    <NavigationContainer>
      <RootNavigation />
      {/* <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar />
      </View> */}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
