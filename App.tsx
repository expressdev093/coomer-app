import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {RootNavigation} from './src/navigations';
import {store, persistor} from './src/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

export const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <NavigationContainer>
          <RootNavigation />
          {/* <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar />
      </View> */}
        </NavigationContainer>
      </PersistGate>
    </Provider>
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
