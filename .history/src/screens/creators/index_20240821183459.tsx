import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Creator, Model} from '../../typings';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ProfileListItem} from '../home/components/profile-list.item';
import {useAppDispatch, useAppSelector} from '../../store';
import {useNavigation} from '@react-navigation/native';
import SearchBar from 'react-native-search-bar';
import {CreateListItem} from './components/creator.item';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CreatorsActions, ICreatorFilter} from '../../store/slices';
import {data} from './testdata';

const ITEM_HEIGHT = 200;

export const CreatorsScreen = () => {
  const [filter, setFilter] = useState<ICreatorFilter>({
    provider: 'All',
    search: undefined,
    sortByDirection: undefined,
    sortedBy: undefined,
  });
  const dispatch = useAppDispatch();
  const {dataSource, creators, isLoaded, isLoading} = useAppSelector(
    state => state.creators,
  );
  const {models} = useAppSelector(state => state.exporteddModelsNames);
  const navigation = useNavigation<any>();
  const searchRef = useRef<SearchBar>(null);
  const [filteredDataSource, setFilteredDataSource] = useState<Model[]>([]);
  const [masterDataSource, setMasterDataSource] = useState<Model[]>([]);
  const [selectionOptions, setSelectOptions] = useState<any[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);

  const [isImageshow, setImageShow] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoaded) {
      getCreators();
    }
  }, [isLoaded]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: (props: any) => {
        return (
          <View style={{flexDirection: 'row'}}>
            <RNPickerSelect
              style={{
                viewContainer: {
                  width: 100,
                },
              }}
              onValueChange={filterbyCategory}
              items={[
                {label: 'All', value: 'All'},
                {label: 'onlyfans', value: 'onlyfans'},
                {label: 'fansly', value: 'fansly'},
              ]}
            />
            <RNPickerSelect
              style={{
                viewContainer: {
                  width: 100,
                },
              }}
              onValueChange={handleSortBy}
              items={[
                {label: 'Date Indexed (asc)', value: 'indexed-asc'},
                {label: 'Date Indexed (desc)', value: 'indexed-desc'},
                {label: 'Date Updated (asc)', value: 'updated-asc'},
                {label: 'Date Updated (desc)', value: 'updated-desc'},
                {label: 'Favorites (asc)', value: 'favorited-asc'},
                {label: 'Favorites (desc)', value: 'favorited-desc'},
              ]}
            />
          </View>
        );
      },
    });
  }, [navigation]);

  const getCreators = async () => {
    try {
      dispatch(CreatorsActions.setLoading(true));
      const response = await axios.get<Creator[]>(
        'https://coomer.su/api/v1/creators.txt',
        {
          headers: {
            //Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );

      const listCreators = response.data;
      listCreators.sort((a, b) => b.indexed - a.indexed);
      //setCreators(response.data);
      const mapModels: Model[] = listCreators.map(c => ({
        id: c.id,
        image: `https://img.coomer.su/icons/${c.service}/${c.id}`,
        name: c.name,
        provider: c.service,
        url: `https://coomer.su/${c.service}/user/${c.id}`,
        text: c.name,
        category: '',
        creator: c,
      }));

      dispatch(CreatorsActions.setCreators(listCreators));
      dispatch(CreatorsActions.setDataSource(mapModels));
    } catch (err: any) {
      console.log(err);
      console.log(JSON.stringify(err, null, 2));
      dispatch(CreatorsActions.setLoading(false));
      Alert.alert('Error', err.message);
    }
  };

  const onModelPress = useCallback(
    (model: Model) => {
      navigation.navigate('ApiDetail', {model: model});
    },
    [navigation],
  );

  const onSearchButtonPress = (text: string) => {
    setFilter(prevState => ({
      ...prevState,
      search: text.length > 0 ? text : undefined,
    }));
  };

  const onCancelButtonPress = () => {
    searchRef.current?.clearText();

   setFilter(prevState => ({
    ...prevState,
    search: undefined,
    sortByDirection: undefined,
    sortedBy: undefined,
    provider: 'All',
   })
  }

  const handleSortBy = (text: string) => {
    const [by, direction] = text.split('-');

    setFilter(prevState => ({
      ...prevState,
      sortedBy: by,
      sortByDirection: direction as any,
    }));
  };

  const filterbyCategory = (text: string) => {
    setFilter(prevState => ({...prevState, provider: text}));
  };

  const renderItem = useCallback(({item}: ListRenderItemInfo<Model>) => {
    return (
      <CreateListItem
        model={item}
        onModelPress={onModelPress}
        isImageShow={isImageshow}
        exported={models.find(m => m === item.name)}
        creator={item.creator!}
      />
    );
  }, []);

  useEffect(() => {
    if (isLoaded) {
      dispatch(CreatorsActions.filterDataSource(filter));
    }
  }, [isLoaded, filter]);

  console.log(filter);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
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
                />
                {filter.search && (
                  <TouchableOpacity onPress={onCancelButtonPress}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                )}
              </View>

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
          onRefresh={() => {
            if (!isLoaded) {
              getCreators();
            }
          }}
          refreshing={isLoading}
        />
      )}
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
