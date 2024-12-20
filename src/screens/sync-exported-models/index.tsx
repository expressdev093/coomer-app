import React from 'react';
import {ActivityIndicator, Button, ScrollView, Text, View} from 'react-native';
import {useReadDirectoryFolders} from '../../hooks';

export const SyncExportedModelScreen = () => {
  const {loading, syncExportedModels, importedModelsList} =
    useReadDirectoryFolders();
  return (
    <View style={{flex: 1, padding: 20}}>
      <Button
        disabled={loading}
        title="Sync Models"
        onPress={syncExportedModels}
      />
      {loading && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <ActivityIndicator size={'large'} />
          <Text>Syncing models...</Text>
        </View>
      )}

      <ScrollView>
        {importedModelsList.map((model, index) => (
          <View key={index + '_' + model}>
            <Text>{model}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
