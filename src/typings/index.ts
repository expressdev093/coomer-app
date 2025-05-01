export type Model = {
  id: string;
  image: string;
  name: string;
  provider: string;
  url: string;
  text: string;
  category?: string;
  creator?: Creator;
};

export type Category = {
  category: string;
  links: Model[];
};

export type Page = {
  title: string;
  model: Model;
  pageLink: string;
  fileName: string;
};

export type Creator = {
  favorited: number;
  id: string;
  indexed: number;
  name: string;
  service: string;
  updated: number;
};

export type DirectoryModel = {
  name: string;
  category: string;
};

interface File {
  name: string;
  path: string;
}

export interface Post {
  id: string;
  user: string;
  embed: any;
  service:
    | 'patreon'
    | 'fanbox'
    | 'discord'
    | 'fantia'
    | 'afdian'
    | 'boosty'
    | 'gumroad'
    | 'subscribestar'
    | 'onlyfans'
    | 'fansly'
    | 'candfans';
  title: string;
  content: string;
  shared_file: boolean;
  added: string;
  published: string;
  edited: Date | null;
  file: File | any;
  attachments: File[];
  poll: any;
  captions: any;
  tags: any;
  downloadableUrls: any[];
}

export interface PostDetail {
  post: {};
}
