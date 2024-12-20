import {getCheerio} from '../helper';
import * as cheerio from 'cheerio';
import axios from 'axios';
const mediaDefinitionRegex =
  /{"defaultQuality":(true|false|\d+),"format":"(\w+)","videoUrl":"(.+?)","quality":(("\d+")|(\[[\d,]*\]))(,"remote":(true|false))?}/g;

const baseUrl = 'https://www.pornhub.com';

export interface MediaDefinition {
  defaultQuality: boolean | number;
  format: string;
  videoUrl: string;
  quality: number | number[];
  remote: boolean;
}

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

  async getVideo(url: string): Promise<void> {
    const response = await axios.get(url); // fetch page

    const htmlString = response.data; // get response text
    const $ = cheerio.load(htmlString);
    const mediaDefinitions = this.parseMediaDefinition(htmlString);
    const title = $('head > title')
      .first()
      .text()
      .replace(' - Pornhub.com', '');
  }
  getMediaDefinition(mediaArray: MediaDefinition[]): MediaDefinition {
    let defaultQualityMedia: MediaDefinition | null = null;
    let highestQualityMedia: MediaDefinition | null = null;
    let highestQualityUpTo720: MediaDefinition | null = null;

    mediaArray.forEach(media => {
      if (media.defaultQuality) {
        defaultQualityMedia = media;
      }
      if (!highestQualityMedia || media.quality > highestQualityMedia.quality) {
        highestQualityMedia = media;
      }
      if (
        media.quality <= 720 &&
        (!highestQualityUpTo720 ||
          media.quality > highestQualityUpTo720.quality)
      ) {
        highestQualityUpTo720 = media;
      }
    });

    return defaultQualityMedia || highestQualityUpTo720 || highestQualityMedia;
  }

  parseMediaDefinition(html: string): MediaDefinition[] {
    const mediaDefinitions: MediaDefinition[] = [];

    while (true) {
      const match = mediaDefinitionRegex.exec(html);
      if (!match) break;

      try {
        const [
          ,
          _defaultQuality,
          format,
          videoUrl,
          _quality,
          ,
          _qualityArray,
          ,
          ,
          _remote,
        ] = match;
        const defaultQuality =
          _defaultQuality === 'true'
            ? true
            : _defaultQuality === 'false'
            ? false
            : +_defaultQuality;
        const quality = _qualityArray
          ? (JSON.parse(_qualityArray) as number[])
          : this.parseStringNumber(_quality);
        const remote = _remote === 'true';

        mediaDefinitions.push({
          defaultQuality,
          format,
          videoUrl,
          quality,
          remote,
        });
      } catch (error) {
        console.warn(`Failed to parse media definition from input: "${match}"`);
        console.warn(error);
      }
    }

    return mediaDefinitions;
  }
  parseStringNumber(str: string): number {
    return +str.replace(/"/g, '');
  }
}
