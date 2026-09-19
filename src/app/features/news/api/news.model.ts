export type NewsType = 'story' | 'job';

interface NewsItemBase {
  id: number;
  by?: string;
  time?: number;
  deleted?: boolean;
  dead?: boolean;
}

export interface Story extends NewsItemBase {
  type: 'story';
  descendants?: number;
  kids?: number[];
  score?: number;
  title?: string;
  url?: string;
  text?: string;
}

export interface Job extends NewsItemBase {
  type: 'job';
  score?: number;
  text?: string;
  title?: string;
  url?: string;
}

export type NewsItem = Story | Job;
