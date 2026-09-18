export type NewsType = 'story' | 'comment' | 'job' | 'poll' | 'pollopt';

export interface Story {
  id: number;
  by?: string;
  descendants?: number;
  kids?: number[];
  score?: number;
  time?: number;
  title?: string;
  type?: NewsType;
  url?: string;
}
