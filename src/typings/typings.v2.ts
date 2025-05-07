export interface CreatorDto {
  /**
   * The unique ID of the creator (likely a stringified number).
   */
  id: string;

  /**
   * The name or username of the creator.
   */
  name: string;

  /**
   * The service/platform the creator is associated with (e.g., 'fanbox', 'patreon').
   */
  service: string;

  /**
   * Whether the creator is favorited (1 = yes, 0 = no).
   */
  favorited: number;

  /**
   * UNIX timestamp when the creator was indexed.
   */
  indexed: number;

  /**
   * UNIX timestamp when the creator was last updated.
   */
  updated: number;

  imageUrl?: string;
  profileUrl?: string;

  category?: string;
}

export interface CreatorPostFileDto {
  name: string;
  path: string;
}

export interface CreatorPostDto {
  id: string;
  user: string;
  service: string;
  title: string;
  content: string;
  embed: Record<string, any>; // can be refined later if embed structure is known
  shared_file: boolean;
  added: string; // ISO date string
  published: string; // ISO date string
  edited: string | null; // ISO date string
  file?: CreatorPostFileDto;
  attachments: CreatorPostFileDto[];
  videos?: CreatorPostVideoDto[];
  poll: string | null;
  captions: string | null;
  tags: string[] | null;
}

export interface CreatorPostDetailFileDto {
  name: string;
  path: string;
}

export interface CreatorPostAttachmentDto {
  server: string;
  name: string;
  extension: string;
  name_extension: string;
  stem: string;
  path: string;
}

export interface CreatorPostDetailDto {
  id: string;
  user: string;
  service: string;
  title: string;
  content: string;
  embed: Record<string, any>; // refine later if needed
  shared_file: boolean;
  added: string; // ISO timestamp
  published: string; // ISO timestamp
  edited: string | null; // ISO timestamp
  file?: CreatorPostDetailFileDto;
  attachments: CreatorPostDetailFileDto[];
  next: string | null;
  prev: string | null;
  poll: string | null;
  captions: string | null;
  tags: string[] | null;
}

export interface CreatorPostVideoDto {
  index: number;
  path: string;
  name: string;
  extension: string;
  name_extension: string;
  server: string;
  size?: number;
  formattedSize?: string;
  downloadUrl?: string;
  urlsToCheck: string[];
}

export interface CreatorPostDetailResponseDto {
  post: CreatorPostDetailDto;
  attachments: CreatorPostAttachmentDto[];
  previews: any[];
  videos: CreatorPostVideoDto[];
  props: any;
}

export interface SaveFileDto {
  fileName: string;
  content: string;
  folderPath: string;
}

export interface ICreatorFilter {
  provider: string;
  search: string | undefined;
  sortedBy: string | undefined;
  sortByDirection: 'asc' | 'desc' | undefined;
}
