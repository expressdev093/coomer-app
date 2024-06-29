//https://bunkr.fi/a/O84V5e9k

import {getCheerio} from '../helper';

//grid-images_box-link

//grid-images_box-txt 3px

type BunkrVideo = {
  videoUrl: string;
  title: string;
  size: string;
  time: string;
  downloadLink: string;
};

export class BunkrAlbumHelper {
  constructor() {
    console.log('BunkrAlbumHelper');
  }

  async fetchVideosLinks(url: string): Promise<BunkrVideo[]> {
    const bunkrVideos: BunkrVideo[] = [];
    const $ = await getCheerio(url);
    $('.grid-images_box').each((index, element) => {
      let title = '';
      let size = '';
      let time = '';
      const videoUrl = $(element).find('a.grid-images_box-link').attr('href');
      const video_tag = $(element).find('img.grid-images_box-img').attr('src')!;
      const downloadLink =
        video_tag.split('thumbs/')[1].split('.png')[0] + '.mp4';
      const pTags = $(element).find('.grid-images_box-txt p');
      pTags.each((index, element) => {
        const text = $(element).text();
        if (index === 0) {
          title = text;
        } else if (index === 1) {
          size = text;
        } else if (index === 2) {
          time = text;
        }
      });

      if (videoUrl) {
        bunkrVideos.push({
          videoUrl,
          title,
          size,
          time,
          downloadLink,
        });
      }
    });

    return bunkrVideos;
  }
}
