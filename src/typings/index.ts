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
