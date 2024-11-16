export interface Ticker {
  text: string;
  color: string;
}

export interface SubscribeData {
  title: string;
  text: string;
  "email-placeholder": string;
  "submit-text": string;
  "agreement-text": string;
  ticker: Ticker;
}

export interface Subscription {
  subscription: SubscribeData;
}
