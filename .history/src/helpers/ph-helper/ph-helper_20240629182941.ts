import {getCheerio} from '../helper';

export class PhHelper {
  constructor() {
    console.log('PhHelper');
  }

  async getPageVideos(url: string): Promise<string[]> {
    const links: string[] = [];
    const $ = await getCheerio(url);
    $('.pcVideoListItem').each((index, element) => {
      const link = $(element).find('a').attr('href');
      links.push(link);
    });
  }
}
