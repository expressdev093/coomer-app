import React from 'react';
import {Model} from '../../../typings';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
type Props = {
  model: Model;
  onModelPress: (model: Model) => void;
  isImageShow: boolean;
};

export const ProfileListItem: React.FC<Props> = ({
  model,
  onModelPress,
  isImageShow,
}) => {
  const handleOpenInBrowser = () => {
    Linking.openURL(model.url);
  };
  return (
    <TouchableOpacity style={styles.item} onPress={() => onModelPress(model)}>
      {isImageShow ? (
        <Image source={{uri: model.image}} style={styles.image} />
      ) : (
        <View style={styles.imageBox} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.name}>{model.name}</Text>
        <Text style={styles.provider}>{model.provider}</Text>
        {/* <Text style={styles.text}>{model.text}</Text> */}
        <View style={styles.categoryView}>
          <Text style={styles.categoryText}>{model.category}</Text>
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={handleOpenInBrowser}>
          <FontAwesome6 name="firefox-browser" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contianer: {
    width: '100%',
    height: 200,
    elevation: 4,
    backgroundColor: '#fff',
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
    width: 100,
    height: 100,
    borderRadius: 25,
    marginRight: 10,
  },

  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'grey',
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
  categoryView: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
    maxWidth: '70%',
  },
  categoryText: {
    color: '#fff',
  },
});
