import axios from 'axios';
import {SettingsState} from '../../store/slices';
import {
  CreatorDto,
  CreatorPostDetailDto,
  CreatorPostDetailResponseDto,
  CreatorPostDto,
} from '../../typings/typings.v2';
import {CoomerApiClient} from './CoomerApiClient';
import {COOMER_ENDPOINTS} from './endpoints';

export class CoomerService {
  private client: CoomerApiClient;
  constructor(private readonly settings: SettingsState) {
    this.client = new CoomerApiClient();
  }

  // Helper function to handle rate-limited requests
  private async rateLimitedRequest<T>(
    url: string,
    params?: Record<string, any>,
    onWait?: (secondsLeft: number) => void,
  ): Promise<T> {
    let requestCount = 0;

    // Wait helper function
    const wait = (seconds: number): Promise<void> =>
      new Promise(resolve => {
        let remaining = seconds;
        const interval = setInterval(() => {
          if (onWait) onWait(remaining); // Update UI on wait time
          remaining--;
          if (remaining <= 0) {
            clearInterval(interval);
            resolve();
          }
        }, 1000);
      });

    // Requesting with rate-limiting
    const fetchWithRateLimit = async (): Promise<T> => {
      if (requestCount >= this.settings.maximumRequest) {
        await wait(this.settings.waitingTime); // Wait if max requests are reached
        requestCount = 0; // Reset the request count
      }

      const response = await this.client.get<T>(url, params);
      requestCount++;

      return response;
    };

    return fetchWithRateLimit();
  }

  async getCreators(service?: string): Promise<CreatorDto[]> {
    const params = service ? {service} : undefined;
    return this.client.get<CreatorDto[]>(COOMER_ENDPOINTS.creators, params);
  }

  async getUserPosts(
    service: string,
    creatorId: string,
    onProgress?: (count: number) => void,
    onWait?: (secondsLeft: number) => void,
  ): Promise<CreatorPostDto[]> {
    const allPosts: CreatorPostDto[] = [];
    let offset = 0;
    const limit = 50;

    while (true) {
      const params = {o: offset.toString()};
      const posts = await this.rateLimitedRequest<CreatorPostDto[]>(
        COOMER_ENDPOINTS.userPosts(service, creatorId),
        params,
        onWait,
      );

      if (!posts.length) break;

      allPosts.push(...posts);
      onProgress?.(allPosts.length);
      offset += limit;
    }

    return allPosts;
  }

  async getPostDetails(
    service: string,
    creatorId: string,
    postId: string,
  ): Promise<CreatorPostDetailResponseDto> {
    const delay = (ms: number) =>
      new Promise(resolve => setTimeout(resolve, ms));

    // Add a delay before sending the request to avoid hitting rate limits
    await delay(300); // 300ms delay

    const response = await this.client.get<CreatorPostDetailResponseDto>(
      COOMER_ENDPOINTS.specificPost(service, creatorId, postId),
      {},
    );

    return response;
  }

  // Function to fetch the post details for each creator and attach them to posts
  async attachPostDetailsToPosts(
    posts: CreatorPostDto[],
    onProgress?: (fetched: number, total: number) => void,
  ): Promise<CreatorPostDto[]> {
    const total = posts.length;
    let requestCount = 0;

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      try {
        const detail = await this.getPostDetails(
          post.service,
          post.user,
          post.id,
        );
        post.videos = detail.videos || [];
      } catch (err) {
        console.error(
          `Failed to fetch post detail for post ID: ${post.id}`,
          err,
        );
      }

      requestCount++;
      onProgress?.(requestCount, total);
    }

    return posts;
  }

  //need function get video size in mb gb format for every url the function accepsts posts: CreatorPostDto[] iterate to every post within every get videos from post.postDetailResponse?.videos this the array combine server and path to make url note after server add /data then path this will be the prefect url i want to just hit the url and get this size with mb or gb format and attach to the current video.size as string

  async addVideoSizes(
    posts: CreatorPostDto[],
    onProgress?: (fetched: number, total: number) => void,
  ): Promise<CreatorPostDto[]> {
    const delay = (ms: number) =>
      new Promise(resolve => setTimeout(resolve, ms));

    let totalVideos = 0;
    let fetchedVideos = 0;

    // First, count the total number of videos across all posts
    posts.forEach(post => {
      if (post.videos) {
        totalVideos += post.videos.length;
      }
    });

    for (const post of posts) {
      const videos = post?.videos;
      if (!videos) continue;

      for (const video of videos) {
        try {
          const url = `${video.server}/data${video.path}`;

          const response = await axios.head(url);
          const contentLength = parseInt(
            response.headers['content-length'] || '0',
            10,
          );

          if (!isNaN(contentLength)) {
            video.size = contentLength;
            const formattedSize = this.getFormattedSize(contentLength);
            video.formattedSize = formattedSize;
            video.downloadUrl = `${url}?f=${this.generateFilename(
              post.id,
              post.title,
              post.published,
              formattedSize,
              video.extension,
            )}`;
          } else {
            video.size = 0;
            video.formattedSize = 'Unknown';
            video.downloadUrl = `${url}?f=${this.generateFilename(
              post.id,
              post.title,
              post.published,
              '',
              video.extension,
            )}`;
          }
        } catch (error) {
          video.size = 0;
          video.formattedSize = 'Error';
        }

        // Update progress after each video is processed
        fetchedVideos++;
        if (onProgress) {
          onProgress(fetchedVideos, totalVideos);
        }

        // Add delay to avoid rate limits
        await delay(300);
      }
    }

    return posts;
  }

  generateFilename(
    postId: string,
    postTitle: string,
    published: string,
    videoSize: string,
    extension: string,
  ): string {
    const date = new Date(published);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    // Sanitize title to remove special characters and limit length
    const safeTitle = (postTitle || 'untitled')
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // Remove illegal file characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .slice(0, 50); // Optional: limit title length

    return `${yyyy}_${mm}_${dd}_${safeTitle}_${postId}_(${videoSize})${extension}`;
  }

  getFormattedSize(contentLength: number): string {
    const sizeInMB = contentLength / (1024 * 1024);
    const formattedSize =
      sizeInMB >= 1024
        ? `${(sizeInMB / 1024).toFixed(2)} GB`
        : `${sizeInMB.toFixed(2)} MB`;

    return formattedSize;
  }

  getDownloadUrlsFromPosts(posts: CreatorPostDto[]) {
    return posts
      .map(post => post.videos)
      .filter(v => v !== undefined)
      .flat()
      .map(v => v.downloadUrl)
      .filter(u => u !== undefined);
  }
}
