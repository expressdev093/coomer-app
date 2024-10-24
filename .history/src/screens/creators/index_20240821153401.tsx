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
import {useAppSelector} from '../../store';
import {useNavigation} from '@react-navigation/native';
import SearchBar from 'react-native-search-bar';
import {CreateListItem} from './components/creator.item';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ITEM_HEIGHT = 200;

export const CreatorsScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const {models} = useAppSelector(state => state.exporteddModelsNames);
  const navigation = useNavigation<any>();
  const searchRef = useRef<SearchBar>(null);
  const [filteredDataSource, setFilteredDataSource] = useState<Model[]>([]);
  const [masterDataSource, setMasterDataSource] = useState<Model[]>([]);
  const [selectionOptions, setSelectOptions] = useState<any[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);

  const [isImageshow, setImageShow] = useState<boolean>(false);

  useEffect(() => {
    getCreators();
  }, []);

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
                {label: 'Date Indexed', value: 'indexed'},
                {label: 'Date Updated', value: 'updated'},
                {label: 'Favorites', value: 'favorited'},
              ]}
            />
          </View>
        );
      },
    });
  }, [navigation]);

  const getCreators = async () => {
    try {
      setLoading(true);
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

      setCreators(listCreators);
      setMasterDataSource(mapModels);
      setFilteredDataSource(mapModels);
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      console.log(JSON.stringify(err, null, 2));
      setLoading(false);
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
    if (text.length > 0) {
      setIsSearched(true);
      setLoading(true);
      setFilteredDataSource(
        masterDataSource.filter(model =>
          model.name.toLocaleLowerCase().includes(text.toLocaleLowerCase()),
        ),
      );
      setLoading(false);
    } else {
      setIsSearched(false);
      onCancelButtonPress();
    }
  };

  const onCancelButtonPress = () => {
    setLoading(true);
    searchRef.current?.clearText();

    setFilteredDataSource(masterDataSource);
    setLoading(false);
    setIsSearched(false);
  };

  const handleSortBy = (text: string) => {
    setFilteredDataSource(prev => {
      prev.sort((a: any, b: any) => b.creator[text] - a.creator[text]);

      return prev;
    });
  };

  const filterbyCategory = (text: string) => {
    if (text === 'All') {
      setFilteredDataSource(masterDataSource);
    } else {
      setFilteredDataSource(
        masterDataSource.filter(model => model.provider === text),
      );
    }
  };

  const renderItem = useCallback(({item}: ListRenderItemInfo<Model>) => {
    return (
      <CreateListItem
        model={item}
        onModelPress={onModelPress}
        isImageShow={isImageshow}
        exported={models.find(m => m === item.name)}
        creator={creators.find(c => c.id === item.id)!}
      />
    );
  }, []);

  console.log(filteredDataSource[0]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      {loading ? (
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
                {isSearched && (
                  <TouchableOpacity onPress={onCancelButtonPress}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                )}
              </View>

              <Text>Found Items : {filteredDataSource.length}</Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={{height: 5}} />}
          data={filteredDataSource}
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
            setFilteredDataSource(masterDataSource);
          }}
          refreshing={loading}
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
