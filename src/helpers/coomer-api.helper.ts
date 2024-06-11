import axios, {AxiosError, isAxiosError} from 'axios';
import {Model} from '../typings';
import RNFS from 'react-native-fs';
import {Alert} from 'react-native';
import {Constants} from '../constants';
import * as ScopedStorage from 'react-native-scoped-storage';

export type OnlyFansDetails = {
  provider: string;
  username: string;
};

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const extractProviderDetails = (url: string): OnlyFansDetails => {
  const regex = /https:\/\/([^\/]+)\/(onlyfans|fansly|[^\/]+)\/user\/([^\/]+)/;
  const match = url.match(regex);

  if (match && match.length === 4) {
    const provider = match[2];
    const username = match[3];
    return {provider: capitalizeFirstLetter(provider), username};
  } else {
    throw new Error('Invalid URL format');
  }
};

interface File {
  name: string;
  path: string;
}

export interface Post {
  id: string;
  user: string;
  embed: any;
  service:
    | 'patreon'
    | 'fanbox'
    | 'discord'
    | 'fantia'
    | 'afdian'
    | 'boosty'
    | 'gumroad'
    | 'subscribestar'
    | 'onlyfans'
    | 'fansly'
    | 'candfans';
  title: string;
  content: string;
  shared_file: boolean;
  added: string;
  published: string;
  edited: Date | null;
  file: File | any;
  attachments: File[];
  poll: any;
  captions: any;
  tags: any;
}

export class CoomerApiHelper {
  private DOWNLOAD_URL = 'https://c6.coomer.su/data';
  private PAGE_SIZE = 50;
  private API_URL = '';
  constructor(private readonly profileUrl: string) {}
  async fetchPosts(offset: number = 0): Promise<Post[]> {
    this.API_URL = this.profileUrl.replace(
      'https://coomer.su',
      'https://coomer.su/api/v1',
    );
    const url = `${this.API_URL}?o=${offset}`;
    const response = await axios.get(url);
    return response.data;
  }

  // Function to introduce a delay
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async startGettingPosts(
    callbackFetchingSize: (message: string) => void,
    callbackDelay: (message: string, isStart: boolean) => void,
  ): Promise<Post[]> {
    let offset = 0;
    let hasMorePosts = true;
    const posts: Post[] = [];

    while (hasMorePosts) {
      const fetchedPosts = await this.fetchPosts(offset);
      if (fetchedPosts.length === 0) {
        hasMorePosts = false;
        break;
      }

      posts.push(...fetchedPosts);
      callbackFetchingSize(`${posts.length} posts are fetched`);
      offset += this.PAGE_SIZE;
      if (offset % 5000 === 0) {
        callbackDelay('Start 30 seconds delay', true);
        console.log('Added 30 seconds delay');
        await this.delay(30000); // Delay for 30 seconds
        console.log('Added 30 seconds delay compeleted');
        callbackDelay('Ends 30 seconds delay', false);
      }
    }

    return posts;
  }

  isTooManyRequestsError(error: AxiosError): boolean {
    return error.response?.status === 429;
  }

  sanitizeFileName(fileName: string): string {
    return this.cleanFileName(fileName).replaceAll(/[\/\\\?%*:|"<>]/g, '_');
  }

  cleanFileName(fileName: string): string {
    return fileName.replace(/[\r\t]+/g, '').trim();
  }

  parsePosts(posts: Post[], filterExtensions: string[]): string[] {
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
        const url = this.generateFileUrl(post);
        const attachmentUrls = this.generateUrlsFromAttachments(post);
        return url ? [url, ...attachmentUrls] : attachmentUrls;
      })
      .forEach(u => {
        downloadUrls.push(...u);
      });

    return downloadUrls
      .filter(url => filterExtensions.some(ext => url.endsWith(ext)))
      .filter(link => link.startsWith('https://'));
  }

  getFileExtension(name: string): string {
    return name.substring(name.lastIndexOf('.') + 1);
  }

  generateUrlsFromAttachments(post: Post): string[] {
    const urls: string[] = [];
    post.attachments.forEach((att, index) => {
      const fileName = this.generateFileName(
        post,
        att.name,
        post.attachments.length > 1 ? index + 1 : 0,
      );
      const downloadUrl = `${this.DOWNLOAD_URL}${
        att.path
      }?f=${this.sanitizeFileName(fileName)}`;

      urls.push(downloadUrl);
    });
    return urls;
  }

  generateFileUrl(post: Post): string | undefined {
    if (Object.keys(post.file).length !== 0) {
      const fileName = this.generateFileName(post, post.file.name);

      return `${this.DOWNLOAD_URL}${post.file.path}?f=${this.sanitizeFileName(
        fileName,
      )}`;
    }
    return undefined;
  }

  generateFileName(post: Post, name: string, index: number = 0): string {
    const extension = this.getFileExtension(name.toLocaleLowerCase());
    const published = post.published;
    const title = post.title;
    const id = post.id;

    const publishedDate = this.formatePublishedDate(published);

    let fileName = `${publishedDate}_${title}_${id}`;
    if (index !== 0) {
      fileName += `-${index}`;
    }

    fileName = this.sanitizeFileName(fileName);
    fileName = fileName.replace(/[. ]/g, '_');
    fileName = fileName.replaceAll(/[\r\t\n]+/g, '').trim();
    fileName += `.${extension}`;

    return fileName;
  }

  formatePublishedDate(published: string): string {
    const date = new Date(published);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}_${month}_${day}`;
  }

  saveToFile = async (
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

  splitTrafficeUrlSaveToFile = async (
    data: string,
    folderName: string,
    fileName: string,
  ) => {
    const dirctoryFolder = `${RNFS.DownloadDirectoryPath}/${Constants.directoryName}/${folderName}`;

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

  getRandomString(): string {
    const arr = [
      'https://c1.coomer.su',
      'https://c2.coomer.su',
      'https://c3.coomer.su',
      'https://c4.coomer.su',
      'https://c5.coomer.su',
      'https://c6.coomer.su',
    ];
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  splitTrafficFordownloadLinks(links: string[]): string[] {
    return links.map(
      link =>
        `${link.replaceAll('https://c6.coomer.su', this.getRandomString())}`,
    );
  }
}
