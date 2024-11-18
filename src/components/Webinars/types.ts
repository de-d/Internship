export interface ProposalItem {
  background: string;
  author: {
    img: string;
    name: string;
    position: string;
  };
  text: string;
  tags: string[];
  date_from: string;
  date_to: string;
  time: string;
}

export interface ProposalsData {
  title: string;
  "browse-all-text": string;
  items: ProposalItem[];
  ticker: { text: string; color: string };
}

export interface Proposals {
  proposals: ProposalsData;
}
