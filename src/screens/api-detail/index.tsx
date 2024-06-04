import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import {CoomerApiHelper, Post} from '../../helpers';
import {Button} from 'react-native';
import {Model} from '../../typings';

import {Constants} from '../../constants';

// const posts: Post[] = [
//   {
//     id: '979155891',
//     user: 'audreyandsadie',
//     service: 'onlyfans',
//     title: 'Mmmm, i thought so!! 🥺👅💦',
//     content: 'Mmmm, i thought so!! 🥺👅💦',
//     embed: {},
//     shared_file: false,
//     added: '2024-05-11T07:42:00.411234',
//     published: '2024-05-10T13:29:02',
//     edited: null,
//     file: {
//       name: '2316x3088_23e68cb6f4997194ed7e9e5deadc425e.jpg',
//       path: '/8d/57/8d571522a37903f834bcbb9db020009b869ff360b9c809e435187966268f274f.jpg',
//     },
//     attachments: [],
//     poll: null,
//     captions: null,
//     tags: null,
//   },
//   {
//     id: '979155533',
//     user: 'audreyandsadie',
//     service: 'onlyfans',
//     title: 'Would you like to return the favour?',
//     content: 'Would you like to return the favour?',
//     embed: {},
//     shared_file: false,
//     added: '2024-05-11T07:42:04.046790',
//     published: '2024-05-10T11:24:02',
//     edited: null,
//     file: {
//       name: '2316x3088_8ba5e318228006c22f2eb647b9034d5b.jpg',
//       path: '/da/53/da536933ef8af114c398bd5f5d35b72e986de6559aaf432fc4c3bcc011d256b4.jpg',
//     },
//     attachments: [],
//     poll: null,
//     captions: null,
//     tags: null,
//   },
//   {
//     id: '979155173',
//     user: 'audreyandsadie',
//     service: 'onlyfans',
//     title: "I'd love to taste you 😍",
//     content: "I'd love to taste you 😍",
//     embed: {},
//     shared_file: false,
//     added: '2024-05-11T07:42:07.388175',
//     published: '2024-05-10T10:23:03',
//     edited: null,
//     file: {
//       name: '2316x3088_3235aedad3fd4963f51a53c1a9a5e959.jpg',
//       path: '/b3/e0/b3e00388f222c9a5b27195257ae2462cfc6520eaaf1d84446d346fa39ee980bc.jpg',
//     },
//     attachments: [],
//     poll: null,
//     captions: null,
//     tags: null,
//   },
//   {
//     id: '1061085435',
//     user: 'audreyandsadie',
//     service: 'onlyfans',
//     title: 'pussy time!!!! 🥳',
//     content: 'pussy time!!!! 🥳',
//     embed: {},
//     shared_file: false,
//     added: '2024-05-11T07:42:10.868009',
//     published: '2024-05-09T18:36:02',
//     edited: null,
//     file: {
//       name: '2316x3088_678c6af8950f14a026d873348225af14.jpg',
//       path: '/67/80/67801cbed9e50110f90729e98dd80b53ad809a1e014bb4b6395994ec3f3ff9fb.jpg',
//     },
//     attachments: [],
//     poll: null,
//     captions: null,
//     tags: null,
//   },
//   {
//     id: '1061084658',
//     user: 'audreyandsadie',
//     service: 'onlyfans',
//     title: 'ok, hands moved... now what? 😏',
//     content: 'ok, hands moved... now what? 😏',
//     embed: {},
//     shared_file: false,
//     added: '2024-05-11T07:42:13.731517',
//     published: '2024-05-09T14:47:08',
//     edited: null,
//     file: {
//       name: '2316x3088_51f36baceac58c2b2759536d3922ac7f.jpg',
//       path: '/f6/07/f607ff6fbb6a887cfa5e8a0b6f01f397be9694172dc9f832b2f0c7fea2c3908c.jpg',
//     },
//     attachments: [],
//     poll: null,
//     captions: null,
//     tags: null,
//   },
//   {
//     id: '1061083668',
//     user: 'audreyandsadie',
//     service: 'onlyfans',
//     title: 'thoughts on my butt? 🙈',
//     content: 'thoughts on my butt? 🙈',
//     embed: {},
//     shared_file: false,
//     added: '2024-05-11T07:42:17.394503',
//     published: '2024-05-09T13:23:08',
//     edited: null,
//     file: {
//       name: '2316x3088_193e59f5dde19dcac6236bb16d2c07d6.jpg',
//       path: '/87/49/8749992a5b9e0f13995be6ef90d22bc89fd00850c9409127f679b4c307e62559.jpg',
//     },
//     attachments: [],
//     poll: null,
//     captions: null,
//     tags: null,
//   },
//   {
//     id: '1061082044',
//     user: 'audreyandsadie',
//     service: 'onlyfans',
//     title: 'should i move my hands? 🤨',
//     content: 'should i move my hands? 🤨',
//     embed: {},
//     shared_file: false,
//     added: '2024-05-11T07:42:20.576568',
//     published: '2024-05-09T11:12:37',
//     edited: null,
//     file: {
//       name: '2316x3088_9b6bd3248c974ce228cb025aecbcf3c4.jpg',
//       path: '/49/04/49046fcf81cdfd9c5ea8fe6b992e3b6175d807079b54f4b1cee5d90bfb2cab89.jpg',
//     },
//     attachments: [],
//     poll: null,
//     captions: null,
//     tags: null,
//   },
//   {
//     id: '1057672673',
//     user: 'audreyandsadie',
//     service: 'onlyfans',
//     title: 'Making out in the sunrays 🌞',
//     content: 'Making out in the sunrays 🌞',
//     embed: {},
//     shared_file: false,
//     added: '2024-05-11T07:42:30.254200',
//     published: '2024-05-08T09:34:03',
//     edited: null,
//     file: {
//       name: '0hph2svrropuonrw2whk5_source.mp4',
//       path: '/bc/6e/bc6ee51f77bfee01adcd0a4a523f4b205dfd1825642ff0c6c6d585e4244ff469.mp4',
//     },
//     attachments: [],
//     poll: null,
//     captions: null,
//     tags: null,
//   },
// ];

export const ApiDetailScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();
  const {params} = useRoute<any>();

  const model: Model = params.model;

  useEffect(() => {
    //fetchPosts();
  }, [model]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${model.name} ${model.provider}`,
    });
  }, [navigation, model]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setMessage('getting posts');
      const apiHelper = new CoomerApiHelper(model.url);
      const posts = await apiHelper.startGettingPosts();
      const parseVideosLinks = apiHelper.parseVideoFiles(posts);
      const parseImagesLinks = apiHelper.pareseImageFiles(posts);

      setMessage('Saving Posts');
      await apiHelper.saveToFile(parseVideosLinks.join('\n'), model, 'video');
      await apiHelper.saveToFile(parseImagesLinks.join('\n'), model, 'images');
      setLoading(false);
      Alert.alert('File created and saved successfully!');
      setMessage('');
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View>
          <ActivityIndicator size={'large'} />
          <Text>{message}</Text>
        </View>
      )}
      <Button title="Fetch Posts" disabled={loading} onPress={fetchPosts} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
