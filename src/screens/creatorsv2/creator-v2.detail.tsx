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

  const fetchCreatorPost = async () => {
    try {
      setLoading(true);
      //await coomerService.addVideoSizes(createrPostsWithDetails);
      const posts = await coomerService.getUserPosts(
        creator.service,
        creator.id,
        count => {
          setMessage(`Fetched ${count} posts`);
        },
        secondsLeft => {
          setMessage(`Waiting... ${secondsLeft}s`);
        },
      );

      setTotalPosts(posts.length);
      setMessage('');

      const postsWithVideos = await coomerService.attachPostDetailsToPosts(
        posts,
        (fetched: number, total: number) => {
          setMessage(`fetched ${fetched}/${total}`);
        },
      );

      const postWithVideoWithSizes = await coomerService.addVideoSizes(
        postsWithVideos,
        (fetched: number, total: number) => {
          setMessage(`fetched vide size ${fetched}/${total}`);
        },
      );
      const videos = coomerService.getDownloadUrlsFromPosts(
        postWithVideoWithSizes,
      );

      const folderPath = `${selectedCategory}/${creator.name} ${creator.service}`;

      await saveFile.save({
        fileName: `${creator.name} ${creator.service} (${videos.length} videos).txt`,
        folderPath: folderPath,
        content: videos.join('\n'),
      });

      await saveFile.save({
        fileName: `${creator.name}-${creator.service}-posts.txt`,
        folderPath: folderPath,
        content: JSON.stringify(postWithVideoWithSizes),
      });

      Alert.alert('File created and saved successfully!');
      setMessage('');
    } catch (error: any) {
      console.log(error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

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
        onPress={fetchCreatorPost}
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
