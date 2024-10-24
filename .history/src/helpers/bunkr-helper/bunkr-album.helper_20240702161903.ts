//https://bunkr.fi/a/O84V5e9k

import {getCheerio} from '../helper';
import axios from 'axios';
import RNFS from 'react-native-fs';
import {Constants} from '../../constants';
import * as ScopedStorage from 'react-native-scoped-storage';

//grid-images_box-link

//grid-images_box-txt 3px

type BunkrVideo = {
  videoUrl: string;
  name: string;
  size: string;
  time: string;
};

type BunkrAlbum = {
  title: string;
  info: string;
  videos: BunkrVideo[];
};

const servers: string[] = [
  'https://taquito.bunkr.ru',
  'https://milkshake.bunkr.ru',
  'https://fries.bunkr.ru',
  'https://burger.bunkr.ru',
  'https://pizza.bunkr.ru',
  'https://meatballs.bunkr.ru',
  'https://kebab.bunkr.ru',
];

export class BunkrAlbumHelper {
  errorLinks: string[] = [];
  constructor() {
    console.log('BunkrAlbumHelper');
  }

  async fetchVideosLinks(url: string): Promise<BunkrAlbum> {
    const bunkrVideos: BunkrVideo[] = [];
    const $ = await getCheerio(url);

    const title = $('h1').text().trim();
    const spanText = $('span.break-normal').text().trim().replace(/\s/g, '');

    $('.grid-images_box').each((index, element) => {
      let size = '';
      let time = '';
      const videoUrl = $(element).find('a.grid-images_box-link').attr('href');
      const video_tag = $(element).find('img.grid-images_box-img').attr('src')!;
      const name = video_tag.split('thumbs/')[1].split('.png')[0] + '.mp4';
      const pTags = $(element).find('.grid-images_box-txt p');
      pTags.each((index, element) => {
        const text = $(element).text();
        if (index === 1) {
          size = text;
        } else if (index === 2) {
          time = text;
        }
      });

      if (videoUrl) {
        bunkrVideos.push({
          videoUrl,
          name,
          size,
          time,
        });
      }
    });

    return {
      title,
      info: spanText,
      videos: bunkrVideos,
    };
  }

  async fetchAll(
    url: string,
    progressCallback: (progress: number) => void,
    logCallback: (url: string) => void,
  ): Promise<{title: string; info: string; urls: string[]}> {
    const bunkrAlbum = await this.fetchVideosLinks(url);
    const videos = bunkrAlbum.videos;
    const links = videos.map(v => v.name);
    const urls = await this.parseVideoLinks(
      links,
      progressCallback,
      logCallback,
    );
    // Calculate total items to process for progress tracking

    return {
      title: bunkrAlbum.title,
      info: bunkrAlbum.info,
      urls,
    };
  }

  async parseVideoLinks(
    videos: string[],
    progressCallback: (progress: number) => void,
    logCallback: (url: string) => void,
  ): Promise<string[]> {
    const totalItems = videos.length;
    let processedItems = 0;
    const urls: string[] = [];
    for (const video of videos) {
      for (const server of servers) {
        const full_video_url: string = `${server}/${video}`;
        logCallback(full_video_url);
        const isValid = await this.download_video(full_video_url, video);

        if (isValid) {
          urls.push(full_video_url);
          processedItems++;

          // Calculate progress percentage
          const progress = (processedItems / totalItems) * 100;

          // Call the progress callback with the current progress
          progressCallback(progress);
          break;
        }
      }
    }
    return urls;
  }

  async download_video(url: string, name: string): Promise<boolean> {
    try {
      //console.log('finding the download url', url);
      const response = await axios.head(url);
      if (response.status === 200) {
        return true;
      }
    } catch (err: any) {
      this.errorLinks.push(name);
      return false;
    }

    return false;
  }

  saveToFile = async (data: string, fileName: string) => {
    const dirctoryFolder = `${RNFS.DownloadDirectoryPath}/${Constants.bunkrDirectory}`;

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
}
