import axios, {AxiosError} from 'axios';
import {Post} from '../helpers';
import {Model} from '../typings';
import RNFS from 'react-native-fs';
import {Constants} from '../constants';
import * as ScopedStorage from 'react-native-scoped-storage';

const DOWNLOAD_URL = 'https://c6.coomer.su/data';
const PAGE_SIZE = 50;

type Props = {
  callbackFetchingSize: (message: string) => void;
  callbackDelay: (message: string, isStart: boolean) => void;
};

export const useApi = (props: Props) => {
  const fetchPosts = async (
    apiUrl: string,
    offset: number = 0,
  ): Promise<Post[]> => {
    const url = `${apiUrl}?o=${offset}`;
    const response = await axios.get(url);
    return response.data;
  };

  const startGettingPosts = async (profileUrl: string): Promise<Post[]> => {
    let offset = 0;
    let hasMorePosts = true;
    const posts: Post[] = [];
    const apiUrl = profileUrl.replace(
      'https://coomer.su',
      'https://coomer.su/api/v1',
    );

    while (hasMorePosts) {
      const fetchedPosts = await fetchPosts(apiUrl, offset);
      if (fetchedPosts.length === 0) {
        hasMorePosts = false;
        break;
      }

      posts.push(...fetchedPosts);
      props.callbackFetchingSize(`${posts.length} posts are fetched`);
      offset += PAGE_SIZE;
      if (offset % 5000 === 0) {
        props.callbackDelay('Start 30 seconds delay', true);
        console.log('Added 30 seconds delay');
        await delay(30000); // Delay for 30 seconds
        console.log('Added 30 seconds delay compeleted');
        props.callbackDelay('Ends 30 seconds delay', false);
      }
    }

    return posts;
  };

  const delay = async (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const isTooManyRequestsError = (error: AxiosError): boolean => {
    return error.response?.status === 429;
  };

  const sanitizeFileName = (fileName: string): string => {
    return cleanFileName(fileName).replaceAll(/[\/\\\?%*:|"<>]/g, '_');
  };

  const cleanFileName = (fileName: string): string => {
    return fileName.replace(/[\r\t]+/g, '').trim();
  };

  const parsePosts = (posts: Post[], filterExtensions: string[]): string[] => {
    const videoFiles = posts
      //.filter(post => post.file && post.file.name)
      .filter(post => {
        // Check if 'file' property is a video file
        if (post.file && post.file.name) {
          const fileName = post.file.name.toLowerCase();
          return filterExtensions.some(ext => fileName.endsWith(ext));
        }

        // Check if any attachment is a video file
        if (
          post.attachments &&
          post.attachments.some(att => {
            const fileName = att.name.toLowerCase();
            return filterExtensions.some(ext => fileName.endsWith(ext));
          })
        ) {
          return true;
        }

        return false;
      });

    const downloadUrls: string[] = [];
    videoFiles
      .map(post => {
        const url = generateFileUrl(post);
        const attachmentUrls = generateUrlsFromAttachments(post);
        return url ? [url, ...attachmentUrls] : attachmentUrls;
      })
      .forEach(u => {
        downloadUrls.push(...u);
      });

    return downloadUrls
      .filter(url => filterExtensions.some(ext => url.endsWith(ext)))
      .filter(link => link.startsWith('https://'));
  };

  const getFileExtension = (name: string): string => {
    return name.substring(name.lastIndexOf('.') + 1);
  };

  const generateUrlsFromAttachments = (post: Post): string[] => {
    const urls: string[] = [];
    post.attachments.forEach((att, index) => {
      const fileName = generateFileName(
        post,
        att.name,
        post.attachments.length > 1 ? index + 1 : 0,
      );
      const downloadUrl = `${DOWNLOAD_URL}${att.path}?f=${sanitizeFileName(
        fileName,
      )}`;

      urls.push(downloadUrl);
    });
    return urls;
  };

  const generateFileUrl = (post: Post): string | undefined => {
    if (Object.keys(post.file).length !== 0) {
      const fileName = generateFileName(post, post.file.name);

      return `${DOWNLOAD_URL}${post.file.path}?f=${sanitizeFileName(fileName)}`;
    }
    return undefined;
  };

  const generateFileName = (
    post: Post,
    name: string,
    index: number = 0,
  ): string => {
    const extension = getFileExtension(name.toLocaleLowerCase());
    const published = post.published;
    const title = post.title;
    const id = post.id;

    const publishedDate = formatePublishedDate(published);

    let fileName = `${publishedDate}_${title}_${id}`;
    if (index !== 0) {
      fileName += `-${index}`;
    }

    fileName = sanitizeFileName(fileName);
    fileName = fileName.replace(/[. ]/g, '_');
    fileName = fileName.replaceAll(/[\r\t\n]+/g, '').trim();
    fileName += `.${extension}`;

    return fileName;
  };

  const formatePublishedDate = (published: string): string => {
    const date = new Date(published);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}_${month}_${day}`;
  };

  const saveToFile = async (
    data: string,
    model: Model,
    length: number,
    type: 'video' | 'images' = 'video',
  ) => {
    const fileName = `${model.name} ${model.provider} (${length} ${type}).txt`;
    const dirctoryFolder = `${RNFS.DownloadDirectoryPath}/${Constants.directoryName}/${model.name} ${model.provider}`;

    const dirExist = await RNFS.exists(dirctoryFolder);
    if (!dirExist) {
      await RNFS.mkdir(dirctoryFolder);
      // await RNFS.unlink(dirctoryFolder);
      // console.log(`Directory ${dirctoryFolder} removed`);
    }

    const path = `${dirctoryFolder}/${fileName}`;

    const fileExist = await RNFS.exists(path);
    if (fileExist) {
      await ScopedStorage.deleteFile(path);
    }

    await RNFS.writeFile(path, data, 'utf8');
  };

  return {startGettingPosts, parsePosts, saveToFile};
};
