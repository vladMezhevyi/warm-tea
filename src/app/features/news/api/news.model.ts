export type NewsType = 'story' | 'job';

export interface Story {
  id: number;
  type: NewsType;
  by?: string;
  time?: number;
  deleted?: boolean;
  dead?: boolean;
  url?: string;
  title?: string;
  text?: string;
  descendants?: number;
  kids?: number[];
  score?: number;
}
