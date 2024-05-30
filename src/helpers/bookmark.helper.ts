import {DocumentPickerResponse} from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import * as cheerio from 'cheerio';
import {Constants} from '../constants';
import {Alert} from 'react-native';
import {Category, Model} from '../typings';
import {makeBookmarkFlat} from './helper';

export const getBookmarkJson = async (
  file?: DocumentPickerResponse,
): Promise<Model[]> => {
  // Load the HTML into Cheerio
  if (file) {
    const html = await RNFS.readFile(file?.uri, 'utf8');
    const $ = cheerio.load(html);

    // Now you can use Cheerio to manipulate and extract data from the HTML

    const linksWithCategory: Category[] = [];
    $('H3').each((index, element) => {
      const title = $(element).text();
      const nextDL = $(element).next('DL');
      const links: any = [];

      nextDL.find('a').each((i, link) => {
        const href = $(link).attr('href');
        const text = $(link).text();
        const id = geturlNameOrId(href);
        const name = getName(text);
        const provider = getProvider(text);
        const image = `https://img.coomer.su/icons/${provider.toLowerCase()}/${id}`;
        links.push({
          id: id,
          image: image,
          name: name,
          provider: provider,
          url: href,
          text: text,
        });
      });

      linksWithCategory.push({
        category: title,
        links,
      });
    });

    return makeBookmarkFlat(linksWithCategory);

    //saveToJsonFile(linksWithCategory);
  }
  return [];
};

async function saveToJsonFile(json: any) {
  const modelName = 'bookmark';
  const fileName = `${modelName}.json`;
  const dirctoryFolder = `${RNFS.DownloadDirectoryPath}/${Constants.directoryName}`;
  if (!(await RNFS.exists(dirctoryFolder))) {
    await RNFS.mkdir(dirctoryFolder);
  }

  const content = JSON.stringify(json);

  const path = `${dirctoryFolder}/${fileName}`;

  try {
    await RNFS.writeFile(path, content, 'utf8');

    Alert.alert('File json and saved successfully!');
  } catch (err: any) {
    Alert.alert('Error', err.message);
  }
}

function getName(text: string) {
  // Define the regular expression to capture the dynamic name
  const regex = /Posts of (.*?) from/;

  // Use the regex to match the text
  const match = text.match(regex);
  ``;
  if (match && match[1]) {
    // Extract the dynamic name
    const dynamicName = match[1].trim();
    return dynamicName;
  } else {
    return text;
  }
}

function geturlNameOrId(url?: string) {
  // Split the URL by '/' and get the last segment
  const segments = (url ?? '').split('/');
  const lastSegment = segments[segments.length - 1];
  return lastSegment;
}

function getProvider(text: string) {
  // Define the regular expression to capture the dynamic name
  const regex = /from (.*?) | Coomer/;

  // Use the regex to match the text
  const match = text.match(regex);

  if (match && match[1]) {
    // Extract the dynamic name
    const dynamicName = match[1].trim();
    return dynamicName;
  } else {
    return '';
  }
}
