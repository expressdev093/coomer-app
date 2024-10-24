export class PhHelper {
  pcVideoListItem;

  constructor() {
    console.log('PhHelper');
  }

  async getPageVideos(url: string): Promise<string[]> {
    const $ = await getCheerio(url);
    $('.pcVideoListItem').each((index, element) => {
      const postLink = $(element).find('a').attr('href');
    });
  }
}
