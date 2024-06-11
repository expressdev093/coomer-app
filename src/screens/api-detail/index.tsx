import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import {CoomerApiHelper, Post} from '../../helpers';
import {Button} from 'react-native';
import {Model} from '../../typings';

import {Constants} from '../../constants';
import {useTimer} from '../../hooks';

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
// {
//   id: '1057672673',
//   user: 'audreyandsadie',
//   service: 'onlyfans',
//   title: 'Making out in the sunrays 🌞',
//   content: 'Making out in the sunrays 🌞',
//   embed: {},
//   shared_file: false,
//   added: '2024-05-11T07:42:30.254200',
//   published: '2024-05-08T09:34:03',
//   edited: null,
//   file: {
//     name: '0hph2svrropuonrw2whk5_source.mp4',
//     path: '/bc/6e/bc6ee51f77bfee01adcd0a4a523f4b205dfd1825642ff0c6c6d585e4244ff469.mp4',
//   },
//   attachments: [],
//   poll: null,
//   captions: null,
//   tags: null,
// },
// ];

// const posts: Post[] = [
//   {
//     id: '610201142411931648',
//     user: '284905230003351552',
//     service: 'fansly',
//     title: '',
//     content:
//       'pretty pussy energy 🌸\n\nand yes i went back to a trimmed bush 🫠',
//     embed: {},
//     shared_file: false,
//     added: '2024-02-21T19:00:51.133661',
//     published: '2024-02-03T16:27:28',
//     edited: null,
//     file: {},
//     attachments: [
//       {
//         name: '610201005782474752.jpeg',
//         path: '/b0/05/b005c7584a1d711b466f33cbfad49a0b6b783f9185d5b8dad2f57b2cb1764cd0.jpg',
//       },
//       {
//         name: '610201004561932289.jpeg',
//         path: '/3c/de/3cde498ca0fb033ba17c1924aff960212e0a0e7d25740c9e3d50d73572daae39.jpg',
//       },
//     ],
//     poll: null,
//     captions: null,
//     tags: null,
//   },
//   {
//     id: '608440618510725121',
//     user: '284905230003351552',
//     service: 'fansly',
//     title: '',
//     content:
//       'Riding Chair First Try\n14:07 mins | 1080p | 60fps\n\nI got an amazing new accessory and have been aching to try it out. A bouncy riding chair so that I can be on top for longer without hurting myself! I had soooo much fun trying out this new toy, and I used multiple angles to make sure we got the best view of my hairy pussy getting stretched out.\n\n#thick #bbw #curvy #chubby #redhead #milf #mombod #bigtits #riding #bbwontop #tummy #redhair #alternative #hairy #hairypussy',
//     embed: {},
//     shared_file: false,
//     added: '2024-02-21T19:01:10.392102',
//     published: '2024-01-29T19:51:47',
//     edited: null,
//     file: {},
//     attachments: [
//       {
//         name: '608439052428914689_preview.mp4',
//         path: '/50/df/50df82c2a03b5972a6063111edb06109bb91c387d3cbfc21941170305bbac490.mp4',
//       },
//     ],
//     poll: null,
//     captions: null,
//     tags: '{thick,bbw,curvy,chubby,redhead,milf,mombod,bigtits,riding,bbwontop,tummy,redhair,alternative,hairy,hairypussy}',
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
  const [seconds, isStarted, startTimer, stopTimer, resetTimer] = useTimer();
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();
  const {params} = useRoute<any>();

  const model: Model = params.model;

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
      const posts = await apiHelper.startGettingPosts(
        m => {
          setMessage(m);
        },
        (m, isStart) => {
          setMessage(m);
          if (isStart) {
            startTimer();
          } else {
            setMessage(m);
            stopTimer();
            resetTimer();
          }
        },
      );

      const parseVideosLinks = apiHelper.splitTrafficFordownloadLinks(
        apiHelper.parsePosts(posts, Constants.videoExtensions),
      );
      const parseImagesLinks = apiHelper.splitTrafficFordownloadLinks(
        apiHelper.parsePosts(posts, Constants.imageExtensions),
      );
      console.log('posts', posts.length);
      console.log('parseVideosLinks', parseVideosLinks.length);
      console.log('parseImagesLinks', parseImagesLinks.length);
      setMessage('Saving Posts');
      await apiHelper.saveToFile(
        parseVideosLinks.join('\n'),
        model,
        parseVideosLinks.length,
        'video',
      );
      await apiHelper.saveToFile(
        parseImagesLinks.join('\n'),
        model,
        parseImagesLinks.length,
        'images',
      );
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
          {isStarted && <Text>{seconds} remaining...</Text>}
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
