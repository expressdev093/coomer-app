/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  StatusBar,
} from 'react-native';
import {Model} from '../../typings';
import {Constants} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import {ProfileListItem} from './components/profile-list.item';
import SearchBar from 'react-native-search-bar';
import RNPickerSelect from 'react-native-picker-select';
import {Storage} from '../../helpers';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const searchRef = useRef<any>(null);
  const [filteredDataSource, setFilteredDataSource] = useState<Model[]>([]);
  const [masterDataSource, setMasterDataSource] = useState<Model[]>([]);
  const [selectionOptions, setSelectOptions] = useState<any[]>([]);

  const [isImageshow, setImageShow] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setImageShow(await Storage.isImageShow());
    })();
  }, []);

  const onModelPress = useCallback(
    (model: Model) => {
      navigation.navigate('Detail', {model: model});
    },
    [navigation],
  );

  useEffect(() => {
    firstTimeLoad();
  }, []);

  const firstTimeLoad = async () => {
    try {
      const isFirstTimeLoad = await Storage.getIsFirstLoad();

      if (isFirstTimeLoad) {
        await Storage.setBookmark(Constants.bookmarks);
        await Storage.setCategories(Constants.categories);
        await Storage.setFirstLoad(false);
      }
      const bookmarks = await Storage.getBookmarks();
      const categories = await Storage.getCategories();
      setMasterDataSource(bookmarks);
      setFilteredDataSource(bookmarks);
      setSelectOptions(categories);
    } catch (err) {}
  };

  const onSearchButtonPress = (text: string) => {
    if (text.length > 0) {
      setFilteredDataSource(
        masterDataSource.filter(model =>
          model.name.toLocaleLowerCase().includes(text.toLocaleLowerCase()),
        ),
      );
    } else {
      onCancelButtonPress();
    }
  };

  const onCancelButtonPress = () => {
    setFilteredDataSource(masterDataSource);
  };

  const filterbyCategory = (text: string) => {
    if (text === 'All') {
      setFilteredDataSource(masterDataSource);
    } else {
      setFilteredDataSource(
        masterDataSource.filter(model =>
          (model.category ?? '')
            ?.toLocaleLowerCase()
            ?.includes((text ?? '').toLocaleLowerCase()),
        ),
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <FlatList
        ListHeaderComponent={
          <View>
            <SearchBar
              ref={searchRef}
              placeholder="Search"
              onChangeText={onSearchButtonPress}
              showsCancelButton={true}
              cancelButtonText="Cancel"
              showsCancelButtonWhileEditing
            />
            <RNPickerSelect
              onValueChange={filterbyCategory}
              items={[{label: 'All', value: 'All'}, ...selectionOptions]}
            />
          </View>
        }
        ItemSeparatorComponent={() => <View style={{height: 5}} />}
        data={filteredDataSource}
        keyExtractor={(item, index) => `${index}_${item.id}`}
        renderItem={({item}) => (
          <ProfileListItem
            model={item}
            onModelPress={onModelPress}
            isImageShow={isImageshow}
          />
          // <CategoryListItem category={item} onModelPress={onModelPress} />
        )}
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
