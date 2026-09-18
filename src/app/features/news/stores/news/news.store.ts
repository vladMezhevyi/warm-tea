import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Story } from '../../api/news.model';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { NewsRepository } from './news.repository';

export type StoryType = 'new' | 'top' | 'best';

interface NewsState {
  stories: Story[];
  totalIDs: number;
  isLoading: boolean;
  perPage: number;
  type: StoryType;
  first: number;
  last: number;
}

const initialState = (): NewsState => {
  const perPage = 25;

  return {
    perPage,
    stories: [],
    totalIDs: 0,
    isLoading: false,
    type: 'new',
    first: 0,
    last: perPage,
  };
};

export const NewsStore = signalStore(
  withState(initialState()),

  withProps(() => ({ repository: inject(NewsRepository) })),

  withComputed(({ totalIDs, stories }) => ({
    canLoadMore: computed(() => stories().length < totalIDs()),
  })),

  withMethods(({ repository, ...store }) => ({
    loadStories: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          const { type, first, last } = store;
          return repository.getStories(type(), first(), last());
        }),
        tap(({ stories, totalIDs }) =>
          patchState(store, (state) => ({
            ...state,
            totalIDs,
            isLoading: false,
            stories: [...state.stories, ...stories],
          })),
        ),
      ),
    ),
  })),

  withMethods((store) => ({
    updateType: (type: StoryType) => {
      patchState(store, { ...initialState(), type });
      store.loadStories();
    },

    loadMore: () => {
      const first = store.last();
      const last = first + store.perPage();

      patchState(store, { first, last });
      store.loadStories();
    },
  })),
);
