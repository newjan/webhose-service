export interface ThreadApiData {
  uuid: string;
  url: string;
  site_full: string;
  site: string;
  site_section: string;
  site_categories: string[];
  section_title: string;
  title: string;
  title_full: string;
  published: string;
  replies_count: number;
  participants_count: number;
  site_type: string;
  country?: string;
  main_image: string;
  performance_score: number;
  domain_rank?: number;
  domain_rank_updated?: Date;
  social: Record<string, any>;
}

export interface PostApiData {
  uuid: string;
  thread: ThreadApiData;
  url: string;
  ord_in_thread: number;
  parent_url?: string;
  author?: string;
  published: string;
  title: string;
  text: string;
  highlightText: string;
  highlightTitle: string;
  highlightThreadTitle: string;
  language: string;
  sentiment?: string;
  categories?: string[];
  topics?: string[];
  ai_allow: boolean;
  has_canonical: boolean;
  webz_reporter: boolean;
  external_links?: string[];
  external_images: string[];
  entities: Record<string, any>;
  syndication: Record<string, any>;
  rating?: string;
  crawled: string;
  updated: string;
}
