//https://bunkr.fi/a/O84V5e9k

import {getCheerio} from '../helper';

//grid-images_box-link

//grid-images_box-txt 3px

type BunkrVideo = {
  videoUrl: string;
  title: string;
  sizes: string;
  time: string;
};

export class BunkrAlbumHelper {
  constructor() {
    console.log('BunkrAlbumHelper');
  }

  async fetchVideosLinks(url: string): Promise<BunkrVideo[]> {
    const bunkrVideos: BunkrVideo[] = [];
    const $ = await getCheerio(url);
    $('.grid-images_box').each((index, element) => {
      const videoUrl = $(element).find('a.grid-images_box-link').attr('href');
      const pTags = $('.grid-images_box-txt p');
      pTags.each((index, element) => {
        const text = $(element).text();
        console.log(`Paragraph ${index + 1}: ${text}`);
      });

      if (videoUrl) {
        bunkrVideos.push({
          videoUrl,
        });
      }
    });

    return bunkrVideos;
  }
}
