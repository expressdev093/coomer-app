import * as cheerio from 'cheerio';
import {Category, Model, Page} from '../typings';
import {Constants} from '../constants';
import axios from 'axios';
import {URL, URLSearchParams} from 'whatwg-url';

export async function getCheerio(url: string) {
  const response = await axios.get(url); // fetch page

  const htmlString = response.data; // get response text
  const $ = cheerio.load(htmlString);

  return $;
}

export async function getTotalSize(url: string): Promise<string> {
  const $ = await getCheerio(url);
  let text = '';
  $('small').each((index, element) => {
    text = $(element).text();
  });

  const parts = text.split('of');
  const textAfterOf = parts[1].trim();

  return textAfterOf;
}

export async function generatePages(model: Model): Promise<[string, Page[]]> {
  const max = await getTotalSize(model.url);
  const baseUrl = `${model.url}?o=`;

  const perpage = 50;

  const pages: Page[] = []; // Array to store generated links

  for (let i = 0; i <= parseInt(max); i += perpage) {
    const link = `${baseUrl}${i}`; // Generate link with incremented "o" value
    pages.push({
      title: `${i}`,
      pageLink: link,
      model: model,
      fileName: `${model.name}_${i}.txt`,
    }); // Add link to the array
  }
  return [max, pages];
}

export async function getUsername(url: string): Promise<string> {
  const $ = await getCheerio(url);
  let text = '';
  const username = $('span[itemprop="name"]').text();

  return username;
}

export async function scrapPages(pages: string[]): Promise<any> {
  const result = await Promise.all(pages.map(page => scrapPage(page)));

  const allPostLinks = result.flat();

  const videoLinks = await Promise.all(
    allPostLinks.map(link => scrapSinglePage(link)),
  );

  return {
    total: videoLinks.flat().length,
    links: videoLinks.flat(),
  };
}

async function scrapPage(url: string): Promise<string[]> {
  const pagePostsLinks: string[] = [];
  const $ = await getCheerio(url);
  console.log('scrapPage', 'start');
  //const $ = cheerio.load(Constants.detailHtml);
  $('article').each((index, element) => {
    // Get the post link from the 'href' attribute of the 'a' tag inside the article
    const postLink = $(element).find('a').attr('href');
    // const image = $(element).find('img.post-card__image').attr('src');

    // Push the post link to the array
    if (postLink) {
      pagePostsLinks.push(`https://coomer.su${postLink}`);
    }
  });
  console.log('scrapPage', 'end', pagePostsLinks.length);
  return pagePostsLinks;
}

async function scrapSinglePage(url: string) {
  const videoLinks: string[] = [];
  const $ = await getCheerio(url);
  const publishedElement = $('.post__published');
  const publishedText = publishedElement.text().trim();
  const publishedDate = publishedText.split(':')[1].trim();

  const postTitleElement = $('.post__title');
  const postTitle = postTitleElement.text().trim();

  $('.post__attachment').each((index, element) => {
    const postLink = $(element).find('a').attr('href');

    if (postLink) {
      videoLinks.push(replaceTitle(postLink, publishedDate, postTitle));
      // videoLinks.push(postLink);
    }
  });
  return videoLinks;
}

function replaceTitle(url: string, date: string, title: string): string {
  const splitUrl = url.split('?f=');
  const baseUrl = splitUrl[0];
  const urlFileName = splitUrl[1];
  const extension = urlFileName.substring(urlFileName.lastIndexOf('.') + 1);
  const newFileName = `${date} ${title} ${new Date().getTime()}.${extension}`;

  const newUrl = `${baseUrl}?f=${newFileName}`;

  return newUrl;
}

export function extractParameterFromString(
  url: string,
  parameterName: string,
): string | null {
  const regex = new RegExp(`${parameterName}=([^&]+)`);
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

export function makeBookmarkFlat(data: Category[]): Model[] {
  const flatData: Model[] = [];

  removeOtherLinksAndEmptyCategory(data).map(d => {
    d.links.map(l => {
      flatData.push({...l, category: d.category});
    });
  });

  return flatData;
}

export function removeOtherLinksAndEmptyCategory(
  categories: Category[],
): Category[] {
  return categories
    .map(cat => ({
      ...cat,
      links: cat.links
        .map(link => ({
          ...link,
          url: link.url.startsWith('https://coomer.party')
            ? link.url.replaceAll('coomer.party', 'coomer.su')
            : link.url,
        }))
        .filter(link => link.url.startsWith('https://coomer.su')),
    }))
    .filter(cat => cat.links.length > 0);
}

export function getCategoriesTitle(categories: Category[]): string[] {
  return categories.map(cat => cat.category);
}

export function getCategorySelectLabelAndValue(
  categories: Category[],
): {label: string; value: string}[] {
  return getCategoriesTitle(categories).map(title => ({
    label: title,
    value: title,
  }));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${formattedSize} ${sizes[i]}`;
}
