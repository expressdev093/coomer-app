import {getCheerio} from '../helper';
import * as cheerio from 'cheerio';
import axios from 'axios';

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

  async getVideo(url: string): Promise<string[]> {
    const response = await axios.get(url); // fetch page

    const htmlString = response.data; // get response text
    const $ = cheerio.load(htmlString);

    return [];
  }
}
