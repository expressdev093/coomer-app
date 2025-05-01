import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../../store';
import {useNavigation} from '@react-navigation/native';
import SearchBar from 'react-native-search-bar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CreatorsV2Actions} from '../../store/slices';
import {CreatorDto, ICreatorFilter} from '../../typings/typings.v2';
import {CoomerService} from '../../helpers/coomer/CoomerService';
import {CreateListItemV2} from './components/creator.item';

const ITEM_HEIGHT = 200;

export const CreatorsV2Screen = () => {
  const [filter, setFilter] = useState<ICreatorFilter>({
    provider: 'All',
    search: undefined,
    sortByDirection: undefined,
    sortedBy: undefined,
  });
  const dispatch = useAppDispatch();
  const {dataSource, isLoaded, isLoading} = useAppSelector(
    state => state.creatorsV2,
  );
  const settings = useAppSelector(state => state.settings);
  const {modelsObj} = useAppSelector(state => state.exporteddModelsNames);
  const navigation = useNavigation<any>();
  const searchRef = useRef<SearchBar>(null);
  const coomerService = new CoomerService({
    ...settings,
    maximumRequest: 30,
  });

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
      dispatch(CreatorsV2Actions.setLoading(true));
      const creators = await coomerService.getCreators();

      creators.sort((a, b) => b.indexed - a.indexed);
      //setCreators(response.data)
      const mapCreators = creators.map(creator => ({
        ...creator,
        imageUrl: `https://img.coomer.su/icons/${creator.service}/${creator.id}`,
        profileUrl: `https://coomer.su/${creator.service}/user/${creator.id}`,
      }));

      dispatch(CreatorsV2Actions.setCreators(mapCreators));
      dispatch(CreatorsV2Actions.setDataSource(mapCreators));
    } catch (err: any) {
      console.log(err);
      console.log(JSON.stringify(err, null, 2));
      dispatch(CreatorsV2Actions.setLoading(false));
      Alert.alert('Error', err.message);
    }
  };

  const onModelPress = useCallback(
    (creator: CreatorDto) => {
      navigation.navigate('CreatorV2Detail', {creator: creator});
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
    }));
  };

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

  const renderItem = useCallback(({item}: ListRenderItemInfo<CreatorDto>) => {
    return (
      <CreateListItemV2
        onModelPress={onModelPress}
        isImageShow={isImageshow}
        exportedModel={modelsObj.find(m => m.id === item.id)}
        creator={item}
      />
    );
  }, []);

  useEffect(() => {
    if (isLoaded) {
      dispatch(CreatorsV2Actions.filterDataSource(filter));
    }
  }, [isLoaded, filter]);

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
