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
  private postDetailCache = new Map<string, CreatorPostDetailResponseDto>();
  private videoSizeCache = new Map<
    string,
    {size: number; formattedSize: string; downloadUrl: string}
  >();

  constructor(private readonly settings: SettingsState) {
    this.client = new CoomerApiClient();
  }

  private async rateLimitedRequest<T>(
    url: string,
    params?: Record<string, any>,
    onWait?: (secondsLeft: number) => void,
  ): Promise<T> {
    let requestCount = 0;

    const wait = (seconds: number): Promise<void> =>
      new Promise(resolve => {
        let remaining = seconds;
        const interval = setInterval(() => {
          onWait?.(remaining);
          remaining--;
          if (remaining <= 0) {
            clearInterval(interval);
            resolve();
          }
        }, 1000);
      });

    const fetchWithRateLimit = async (): Promise<T> => {
      if (requestCount >= this.settings.maximumRequest) {
        await wait(this.settings.waitingTime);
        requestCount = 0;
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
    const cacheKey = `${service}:${creatorId}:${postId}`;
    if (this.postDetailCache.has(cacheKey)) {
      return this.postDetailCache.get(cacheKey)!;
    }

    const result = await this.client.get<CreatorPostDetailResponseDto>(
      COOMER_ENDPOINTS.specificPost(service, creatorId, postId),
    );

    this.postDetailCache.set(cacheKey, result);
    return result;
  }

  async attachPostDetailsToPosts(
    posts: CreatorPostDto[],
    onProgress?: (fetched: number, total: number) => void,
  ): Promise<CreatorPostDto[]> {
    const total = posts.length;
    let fetched = 0;

    await this.runWithConcurrency(posts, 10, async post => {
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

      fetched++;
      onProgress?.(fetched, total);
    });

    return posts;
  }

  async addVideoSizes(
    posts: CreatorPostDto[],
    onProgress?: (fetched: number, total: number) => void,
  ): Promise<CreatorPostDto[]> {
    let total = 0;
    let fetched = 0;
    const videosWithPost = posts.flatMap(post =>
      (post.videos || []).map(video => ({post, video})),
    );

    total = videosWithPost.length;

    await this.runWithConcurrency(videosWithPost, 10, async ({post, video}) => {
      const url = `${video.server}/data${video.path}`;

      if (this.videoSizeCache.has(url)) {
        const cached = this.videoSizeCache.get(url)!;
        video.size = cached.size;
        video.formattedSize = cached.formattedSize;
        video.downloadUrl = cached.downloadUrl;
      } else {
        try {
          const response = await axios.head(url);
          const contentLength = parseInt(
            response.headers['content-length'] || '0',
            10,
          );

          const size = isNaN(contentLength) ? 0 : contentLength;
          const formattedSize = isNaN(contentLength)
            ? 'Unknown'
            : this.getFormattedSize(contentLength);
          const downloadUrl = `${url}?f=${this.generateFilename(
            post.id,
            post.title,
            post.published,
            formattedSize,
            video.extension,
          )}`;

          video.size = size;
          video.formattedSize = formattedSize;
          video.downloadUrl = downloadUrl;

          this.videoSizeCache.set(url, {size, formattedSize, downloadUrl});
        } catch {
          video.size = 0;
          video.formattedSize = 'Error';
        }
      }

      fetched++;
      onProgress?.(fetched, total);
    });

    return posts;
  }

  async runWithConcurrency<T>(
    items: T[],
    limit: number,
    handler: (item: T) => Promise<void>,
  ) {
    const executing: Promise<void>[] = [];

    for (const item of items) {
      const p = handler(item);
      executing.push(p);

      if (executing.length >= limit) {
        await Promise.race(executing);
        executing.splice(
          0,
          executing.findIndex(p => p === Promise.race(executing)) + 1,
        );
      }
    }

    await Promise.all(executing);
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

    const safeTitle = (postTitle || 'untitled')
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 50);

    return `${yyyy}_${mm}_${dd}_${safeTitle}_${postId}_(${videoSize})${extension}`;
  }

  getFormattedSize(contentLength: number): string {
    const sizeInMB = contentLength / (1024 * 1024);
    return sizeInMB >= 1024
      ? `${(sizeInMB / 1024).toFixed(2)} GB`
      : `${sizeInMB.toFixed(2)} MB`;
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
