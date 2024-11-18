export interface FooterItem {
  label: string;
  items: {
    label: string;
    url: string;
  }[];
}

interface ContactLink {
  label: string;
  url: string;
}

interface Subscription {
  "email-placeholder": string;
  "submit-text": string;
}

export interface Contacts {
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
  links: ContactLink[];
  subscription: Subscription;
}

export interface FooterData {
  footer: FooterItem[];
}
