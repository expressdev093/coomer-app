import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItemInfo,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Creator, Model} from '../../typings';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../../store';
import {useNavigation} from '@react-navigation/native';
import SearchBar from 'react-native-search-bar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CreateListItem} from '../creators/components/creator.item';

const ITEM_HEIGHT = 200;

export const ExportedModelsScreen = () => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchText, setSearchText] = useState<string>('');
  const searchRef = useRef<SearchBar>(null);
  const {modelsObj} = useAppSelector(state => state.exporteddModelsNames);
  const navigation = useNavigation<any>();

  const dataSource = useMemo(() => {
    return modelsObj.filter(model => {
      const matchesCategory =
        filterCategory === 'All' ||
        (model.category ?? '')
          .toLowerCase()
          .includes(filterCategory.toLowerCase());

      const matchesSearch =
        !searchText ||
        (model.name ?? '').toLowerCase().includes(searchText.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [modelsObj, filterCategory, searchText]);

  const onSearchButtonPress = (text: string) => {
    setSearchText(text);
    // setFilter(prevState => ({
    //   ...prevState,
    //   search: text.length > 0 ? text : undefined,
    // }));
  };

  const onModelPress = useCallback(
    (model: Model) => {
      navigation.navigate('ExportedModelDetail', {model: model});
    },
    [navigation],
  );

  const categories = modelsObj
    .map(obj => ({
      label: obj.category!,
      value: obj.category!,
    }))
    .reduce((acc, next: any) => {
      if (!acc.some((item: any) => item.value === next.value)) {
        acc.push(next);
      }
      return acc;
    }, [] as any)
    .sort((a: any, b: any) => a.label.localeCompare(b.label));

  const renderItem = useCallback(({item}: ListRenderItemInfo<Model>) => {
    return (
      <CreateListItem
        model={item}
        onModelPress={onModelPress}
        isImageShow={true}
        exportedModel={item}
        creator={item.creator!}
      />
    );
  }, []);

  const onCancelButtonPress = () => {
    searchRef.current?.clearText();

    setSearchText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />

      <FlatList
        ListHeaderComponent={
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <SearchBar
                style={{flex: 1, height: 60}}
                ref={searchRef}
                placeholder="Search"
                onSearchButtonPress={onSearchButtonPress}
                showsCancelButton={true}
                cancelButtonText="Cancel"
                showsCancelButtonWhileEditing
                onCancelButtonPress={onCancelButtonPress}
              />

              {searchText && (
                <TouchableOpacity onPress={onCancelButtonPress}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              )}
            </View>
            <RNPickerSelect
              onValueChange={cat => setFilterCategory(cat)}
              items={[{label: 'All', value: 'All'}, ...categories]}
            />
            <Text>Found Items : {dataSource.length}</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{height: 5}} />}
        data={dataSource}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
        keyExtractor={(item, index) => `${index}_${item.id}`}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f7f7f7',
    padding: 5,
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  provider: {
    fontSize: 14,
    color: '#777',
  },
  text: {
    fontSize: 12,
    color: '#555',
  },
});
