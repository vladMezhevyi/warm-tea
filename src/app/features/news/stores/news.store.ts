import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Story } from '../api/news.model';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { NewsApi } from '../api/news.api';
import { forkJoin, Observable, pipe, switchMap, tap } from 'rxjs';

export type StoryType = 'new' | 'top' | 'best';

interface NewsState {
  stories: Story[];
  ids: number[];
  isLoading: boolean;
  type: StoryType;
  first: number;
  last: number;
}

const initialState: NewsState = {
  stories: [],
  ids: [],
  isLoading: false,
  type: 'new',
  first: 0,
  last: 2,
};

export const NewsStore = signalStore(
  withState(initialState),

  withProps(() => ({ api: inject(NewsApi) })),

  withComputed(({ ids, last }) => ({
    canLoadMore: computed(() => last() < ids().length),
  })),

  withMethods(({ api, ...store }) => ({
    loadStories: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          const strategy: Record<StoryType, Observable<number[]>> = {
            new: api.getNewStories(),
            top: api.getTopStories(),
            best: api.getBestStories(),
          };

          return strategy[store.type()].pipe(tap((ids) => patchState(store, { ids })));
        }),
        switchMap((ids) => {
          const { first, last } = store;
          const slicedIDs = ids.slice(first(), last());

          return forkJoin(slicedIDs.map((id) => api.getStory(id)));
        }),
        tap((stories) =>
          patchState(store, (state) => ({
            ...state,
            isLoading: false,
            stories: [...state.stories, ...stories],
          })),
        ),
      ),
    ),
  })),

  withMethods((store) => ({
    updateType: (type: StoryType) => {
      patchState(store, { ...initialState, type });
      store.loadStories();
    },

    loadMore: () => {
      const first = store.last();
      const last = first + 2;

      patchState(store, { first, last });
      store.loadStories();
    },
  })),
);
