import {getCheerio} from '../helper';

const baseUrl = 'https://www.pornhub.com';

export class PhHelper {
  constructor() {
    console.log('PhHelper');
  }

  async getPageVideos(url: string): Promise<string[]> {
    const links: string[] = [];
    const $ = await getCheerio(url);
    $('.pcVideoListItem').each((index, element) => {
      const link = $(element).find('a').attr('href')!;
      links.push(baseUrl + link);
    });

    return links;
  }

  async getVideo(url: string): Promise<string> {
    const $ = await getCheerio(url);
    const video = $('.video-player').attr('src')!;
    return video;
  }
}
