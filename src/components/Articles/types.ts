export interface ArticleItem {
  title: string;
  text: string;
  accent: string;
  date: string;
  duration: number;
  size: string;
  tags: string[];
  img: {
    url: string;
    shape: string;
  };
  stamp: {
    word: string;
    type: string;
    position: string;
  };
}

export interface ArticleData {
  items: ArticleItem[];
  ticker: {
    text: string;
    color: string;
  };
}

export interface Content {
  content: ArticleData;
}
