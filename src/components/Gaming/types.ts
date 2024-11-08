export interface SectionItem {
  title: string;
  text: string;
  accent: string;
  date: string;
  duration: number;
  "browse-text": string;
  size: string;
  tags: string[];
  img: { url: string; shape: string };
  stamp: { word: string; type: string; position: string };
}

export interface SectionData {
  items: SectionItem[];
  ticker: { text: string; color: string };
}

export interface Sections {
  main: SectionData;
}
