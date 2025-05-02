import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../store';
import {CoomerService} from '../../helpers/coomer/CoomerService';
import {SaveFile} from '../../helpers/coomer/SaveFile';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CreatorDto} from '../../typings/typings.v2';
import {ExportedModelActions} from '../../store/slices';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SingleChoiceDialog from '../../components/single-choice-dialog';
import BackgroundService from 'react-native-background-actions';
import {PermissionsAndroid, Platform} from 'react-native';
import {useCreatorQueue} from '../../hooks/creatorQueueHook';

export const CreatorV2Detail = () => {
  const dispatch = useAppDispatch();
  const {params} = useRoute<any>();
  const navigation = useNavigation();
  const creator: CreatorDto = params.creator;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const settings = useAppSelector(state => state.settings);
  const coomerService: CoomerService = new CoomerService({
    ...settings,
    maximumRequest: 30,
  });

  const saveFile = new SaveFile();

  const {queueCreator} = useCreatorQueue({
    selectedCategory,
    coomerService,
    saveFile,
    setMessage,
    setTotalPosts,
    setLoading,
  });

  //   const veryIntensiveTask = async (taskData: any) => {
  //     const {
  //       creator,
  //       selectedCategory,
  //       coomerService,
  //       saveFile,
  //       setMessage,
  //       setTotalPosts,
  //       setLoading,
  //     } = taskData;

  //     try {
  //       const posts = await coomerService.getUserPosts(
  //         creator.service,
  //         creator.id,
  //         (count: number) => setMessage(`Fetched ${count} posts`),
  //         (secondsLeft: number) => setMessage(`Waiting... ${secondsLeft}s`),
  //       );

  //       setTotalPosts(posts.length);
  //       setMessage('');

  //       const postsWithVideos = await coomerService.attachPostDetailsToPosts(
  //         posts,
  //         (fetched: number, total: number) =>
  //           setMessage(`Fetched post details ${fetched}/${total}`),
  //       );

  //       await coomerService.addVideoSizes(
  //         postsWithVideos,
  //         (fetched: number, total: number) =>
  //           setMessage(`Fetched video size ${fetched}/${total}`),
  //       );

  //       const videos = coomerService.getDownloadUrlsFromPosts(postsWithVideos);

  //       const folderPath = `${selectedCategory}/${creator.name} ${creator.service}`;

  //       await saveFile.save({
  //         fileName: `${creator.name} ${creator.service} (${videos.length} videos).txt`,
  //         folderPath,
  //         content: videos.join('\n'),
  //       });

  //       await saveFile.save({
  //         fileName: `${creator.name}-${creator.service}-posts.txt`,
  //         folderPath,
  //         content: JSON.stringify(postsWithVideos),
  //       });

  //       Alert.alert('Success', 'Files saved successfully');
  //     } catch (error: any) {
  //       console.error(error);
  //       Alert.alert('Error', error.message || 'Something went wrong');
  //     } finally {
  //       setLoading(false);
  //       await BackgroundService.stop();
  //     }
  //   };

  //   const fetchCreatorPost = async () => {
  //     const options = {
  //       taskName: `${creator.name} ${creator.service}`,
  //       taskTitle: `Downloading ${creator.name} ${creator.service} Content`,
  //       taskDesc: 'Fetching posts and video sizes...',
  //       taskIcon: {
  //         name: 'ic_launcher', // Ensure this icon exists in res/drawable
  //         type: 'mipmap',
  //       },
  //       color: '#ff6600',
  //       linkingURI: '', // Optional: open app on notification tap
  //       parameters: {
  //         creator,
  //         selectedCategory,
  //         coomerService,
  //         saveFile,
  //         setMessage,
  //         setTotalPosts,
  //         setLoading,
  //       },
  //     };

  //     await BackgroundService.start(veryIntensiveTask, options);
  //   };

  useEffect(() => {
    (async () => {
      await BackgroundService.updateNotification({
        taskDesc: message || '',
      });
    })();
  }, [message]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${creator.name} ${creator.service}`,
      headerRight: (props: any) => {
        return (
          <TouchableOpacity
            onPress={
              () => {}
              //   dispatch(
              //     ExportedModelActions.addModels({
              //       ...model,
              //       category: selectedCategory || 'default',
              //     }),
              //   )
            }>
            <MaterialIcons name="check" size={24} color={'#000'} />
          </TouchableOpacity>
        );
      },
    });
  }, [navigation, creator]);

  const handleOptionSelect = (option: string) => {
    setSelectedCategory(option);
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // Close the dialog when an option is selected or cancelled
  };

  const handleDialogOpen = () => {
    setDialogOpen(true); // Open the dialog when the button is pressed
  };

  return (
    <View style={styles.container}>
      <View>
        <Button title="Select an Option" onPress={handleDialogOpen} />
        <SingleChoiceDialog
          options={settings.categories}
          onSelect={handleOptionSelect}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
        />
      </View>
      <Text>Found Posts {totalPosts}</Text>
      <Button
        title="Fetch Posts"
        disabled={loading}
        onPress={() => queueCreator(creator)}
      />
      <Text>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
