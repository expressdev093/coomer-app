import React from 'react';
import {ActivityIndicator, Button, ScrollView, Text, View} from 'react-native';
import {useReadDirectoryFolders} from '../../hooks';
import {useAppDispatch, useAppSelector} from '../../store';
import {Model} from '../../typings';
import {ExportedModelActions} from '../../store/slices';
import {exportedModels} from '../../constants';

export const SyncExportedModelScreen = () => {
  const {loading, syncExportedModels, importedModelsList} =
    useReadDirectoryFolders();

  const {modelsObj} = useAppSelector(state => state.exporteddModelsNames);

  const syncModelStringTObj = () => {
    console.log('start - exporting');
    // const modelsToSync: Model[] = exportedModels
    //   .map(modelName => {
    //     return dataSource.find(model => model.name === modelName);
    //   })
    //   .filter(m => m !== undefined);

    // dispatch(ExportedModelActions.addBulkModels(modelsToSync));
    console.log(modelsObj.length);
    console.log('end - exporting');
  };

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
