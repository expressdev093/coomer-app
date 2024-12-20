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
  constructor() {
    console.log('BunkrAlbumHelper');
  }

  async fetchVideosLinks(url: string): Promise<BunkrVideo[]> {
    const bunkrVideos: BunkrVideo[] = [];
    const $ = await getCheerio(url);
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

    return bunkrVideos;
  }

  async fetchAll(url: string): Promise<string[]> {
    const urls: string[] = [];
    const videos = await this.fetchVideosLinks(url);
    //const videos = [videosAll[0]];
    for (const video of videos) {
      for (const server of servers) {
        const full_video_url: string = `${server}/${video.name}`;
        const isValid = await this.download_video(full_video_url, video.name);
        if (isValid) {
          urls.push(full_video_url);
          break;
        }
      }
      //   servers.forEach(server => {
      //     const full_video_url: string = `${server}/${video_url}`;
      //     console.log(full_video_url); // Output the full video URL
      //   });
    }
    return urls;
  }

  async download_video(url: string, name: string): Promise<boolean> {
    try {
      const response = await axios.head(url);
      if (response.status === 200) {
        console.log('success', url);
        return true;
      }
    } catch (err: any) {
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
