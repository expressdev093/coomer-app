//https://bunkr.fi/a/O84V5e9k

import {getCheerio} from '../helper';

//grid-images_box-link

//grid-images_box-txt 3px

type BunkrVideo = {
  link: string;
  title: string;
  sizes: string;
};

export class BunkrAlbumHelper {
  constructor() {
    console.log('BunkrAlbumHelper');
  }

  async fetchVideosLinks(url: string): Promise<BunkrVideo[]> {
    const $ = getCheerio(url);
  }
}
