import { Story } from '../api/news.model';

export const createStory = (id: number): Story => {
  return {
    id,
    type: 'story',
    title: `Story - ${id}`,
  };
};

export const createArray = (length: number): number[] => {
  return Array.from({ length }, (_, i) => i + 1);
};
