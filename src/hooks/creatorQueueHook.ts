import {useRef, useCallback, useEffect} from 'react';
import BackgroundService from 'react-native-background-actions';
import {Alert, PermissionsAndroid, Platform} from 'react-native'; // optional
import {CreatorDto} from '../typings/typings.v2';

import PushNotification from 'react-native-push-notification';
import {CoomerService} from '../helpers/coomer/CoomerService';

PushNotification.createChannel(
  {
    channelId: 'creator-tasks', // must match the ID used below
    channelName: 'Creator Task Notifications',
  },
  created => console.log(`createChannel returned '${created}'`),
);

type UseCreatorQueueParams = {
  selectedCategory: string | null;
  coomerService: CoomerService;
  saveFile: any;
  setMessage: (msg: string) => void;
  setTotalPosts: (count: number) => void;
  setLoading: (val: boolean) => void;
};

export const useCreatorQueue = ({
  selectedCategory,
  coomerService,
  saveFile,
  setMessage,
  setTotalPosts,
  setLoading,
}: UseCreatorQueueParams) => {
  const queueRef = useRef<CreatorDto[]>([]);
  const isProcessingRef = useRef(false);

  const veryIntensiveTask = async () => {
    while (queueRef.current.length > 0) {
      const creator = queueRef.current.shift();
      if (!creator) continue;

      try {
        setMessage(`Starting ${creator.name}...`);

        const posts = await coomerService.getUserPosts(
          creator.service,
          creator.id,
          (count: number) =>
            setMessage(`Fetched ${count} posts for ${creator.name}`),
          (secondsLeft: number) => setMessage(`Waiting... ${secondsLeft}s`),
        );

        setTotalPosts(posts.length);
        setMessage('');
        const postsWithVideos = coomerService.extractVideosFromPosts(posts);
        const videosWithSize =
          await coomerService.resolveValidVideoUrlsAndSetSize(
            postsWithVideos,
            (fetched: number, total: number) =>
              setMessage(
                `Fetched post details ${fetched}/${total} for ${creator.name}`,
              ),
          );
        // console.log(JSON.stringify(postsWithVideos, null, 2));

        // const postsWithVideos = await coomerService.attachPostDetailsToPosts(
        // posts,
        // (fetched: number, total: number) =>
        //   setMessage(
        //     `Fetched post details ${fetched}/${total} for ${creator.name}`,
        //   ),
        // );

        // await coomerService.addVideoSizes(
        //   postsWithVideos,
        //   (fetched: number, total: number) =>
        //     setMessage(
        //       `Fetched video size ${fetched}/${total} for ${creator.name}`,
        //     ),
        // );

        const videos = coomerService.getDownloadUrlsFromPosts(videosWithSize);
        const folderPath = `${selectedCategory}/${creator.name} ${creator.service}`;

        await saveFile.save({
          fileName: `${creator.name} ${creator.service} (${videos.length} videos).txt`,
          folderPath,
          content: videos.join('\n'),
        });

        await saveFile.save({
          fileName: `${creator.name}-${creator.service}-posts.txt`,
          folderPath,
          content: JSON.stringify(postsWithVideos),
        });

        await saveFile.save({
          fileName: `${creator.name} ${creator.service} (info).txt`,
          folderPath,
          content: JSON.stringify(
            {...creator, category: selectedCategory || 'default'},
            null,
            2,
          ),
        });

        setMessage(`Finished ${creator.name}`);
        PushNotification.localNotification({
          channelId: 'creator-tasks',
          title: 'Download Complete',
          message: `${creator.name} ${creator.service} has been processed.`,
          playSound: true,
          soundName: 'default',
        });

        Alert.alert('Saved', `Model content exported`);
      } catch (error: any) {
        console.error(error);
        Alert.alert('Error', `Failed ${creator.name}: ${error.message}`);
      }
    }

    isProcessingRef.current = false;
    setLoading(false);
    await BackgroundService.stop();
  };

  const queueCreator = useCallback(
    async (creator: CreatorDto) => {
      queueRef.current.push(creator);

      if (!isProcessingRef.current) {
        isProcessingRef.current = true;

        await BackgroundService.start(veryIntensiveTask, {
          taskName: `${creator.name} ${creator.service}`,
          taskTitle: `Downloading ${creator.name} ${creator.service} Content`,
          taskDesc: `Processing ${creator.name}...`,
          taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
          },
          color: '#ff6600',
          parameters: {},
        });
      }
    },
    [selectedCategory, coomerService, saveFile],
  );

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    if (Platform.Version >= '33') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('Notification permission not granted');
      }
    }
  };

  return {queueCreator};
};
