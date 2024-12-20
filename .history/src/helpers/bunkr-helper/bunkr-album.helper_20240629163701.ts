//https://bunkr.fi/a/O84V5e9k

import {getCheerio} from '../helper';

//grid-images_box-link

//grid-images_box-txt 3px

type BunkrVideo = {
  videoUrl: string;
  // title: string;
  //sizes: string;
};

export class BunkrAlbumHelper {
  constructor() {
    console.log('BunkrAlbumHelper');
  }

  async fetchVideosLinks(url: string): Promise<BunkrVideo[]> {
    const bunkrVideo: BunkrVideo[] = [];
    const $ = await getCheerio(url);
    $('.grid-images_box').each((index, element) => {
      const videoUrl = $(element).find('a.grid-images_box-link').attr('href');
      if (videoUrl) {
        bunkrVideo.push({
          videoUrl,
        });
      }
    });
  }
}
