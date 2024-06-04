import axios, {isAxiosError} from 'axios';
import {Model} from '../typings';
import RNFS from 'react-native-fs';
import {Alert} from 'react-native';
import {Constants} from '../constants';

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
  file: File;
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

  sanitizeFileName(fileName: string): string {
    return fileName.replace(/[\/\\\?%*:|"<>]/g, '_');
  }

  async startGettingPosts(): Promise<Post[]> {
    let offset = 0;
    let hasMorePosts = true;
    const posts: Post[] = [];

    //await fs.ensureDir(OUTPUT_DIR);

    while (hasMorePosts) {
      const fetchedPosts = await this.fetchPosts(offset);
      if (fetchedPosts.length === 0) {
        hasMorePosts = false;
        break;
      }

      posts.push(...fetchedPosts);
      offset += this.PAGE_SIZE;
    }

    return posts;
  }

  parseVideoFiles(posts: Post[]): string[] {
    const videoExtensions = [
      '.mp4',
      '.mov',
      '.avi',
      '.mkv',
      '.wmv',
      '.flv',
      '.webm',
      '.m4v',
    ];

    const videoFiles = posts
      .filter(post => post.file && post.file.name)
      .filter(item => {
        const fileName = item.file.name.toLowerCase();
        return videoExtensions.some(ext => fileName.endsWith(ext));
      });

    return videoFiles.map(post => this.generateFileUrl(post));
  }

  pareseImageFiles(posts: Post[]): string[] {
    const videoExtensions = [
      '.mp4',
      '.mov',
      '.avi',
      '.mkv',
      '.wmv',
      '.flv',
      '.webm',
      '.m4v',
    ];

    const videoFiles = posts
      .filter(post => post.file && post.file.name)
      .filter(item => {
        const fileName = item.file.name.toLowerCase();
        return !videoExtensions.some(ext => fileName.endsWith(ext));
      });

    return videoFiles.map(post => this.generateFileUrl(post));
  }

  getFileExtension(name: string): string {
    return name.substring(name.lastIndexOf('.') + 1);
  }

  generateFileUrl(post: Post): string {
    const extension = this.getFileExtension(post.file.name.toLocaleLowerCase());
    const published = post.published;
    const title = post.title;
    const id = post.id;
    const path = post.file.path;

    const publishedDate = this.formatePublishedDate(published);

    const fileName = `${publishedDate}-${title}-${id}.${extension}`;

    return `${this.DOWNLOAD_URL}${path}?f=${this.sanitizeFileName(fileName)}`;
  }

  formatePublishedDate(published: string): string {
    const date = new Date(published);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  saveToFile = async (
    data: string,
    model: Model,
    type: 'video' | 'images' = 'video',
  ) => {
    const fileName = `${model.name} ${model.provider} (${type}).txt`;
    const dirctoryFolder = `${RNFS.DownloadDirectoryPath}/${Constants.directoryName}/${model.name} ${model.provider}`;

    const path = `${dirctoryFolder}/${fileName}`;
    const fileExists = await RNFS.exists(path);
    if (fileExists) {
      // If file exists, remove it first
      console.log('Remove file');
      await RNFS.unlink(path);
    }
    if (!(await RNFS.exists(dirctoryFolder))) {
      await RNFS.mkdir(dirctoryFolder);
    }

    await RNFS.writeFile(path, data, 'utf8');
  };
}
