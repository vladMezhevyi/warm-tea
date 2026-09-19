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
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { NewsRepository } from './news.repository';

export type StoryType = 'new' | 'top' | 'best';

interface NewsState {
  stories: Story[];
  totalIDs: number;
  isLoading: boolean;
  perPage: number;
  type: StoryType;
  nextIDIndex: number;
  error: string | null;
}

const initialState: NewsState = {
  perPage: 2,
  stories: [],
  totalIDs: 0,
  isLoading: false,
  type: 'new',
  nextIDIndex: 0,
  error: null,
};

export const NewsStore = signalStore(
  withState(initialState),

  withProps(() => ({ repository: inject(NewsRepository) })),

  withComputed(({ totalIDs, stories, error }) => ({
    canLoadMore: computed<boolean>(() => !error() && stories().length < totalIDs()),
  })),

  withMethods(({ repository, ...store }) => ({
    loadStories: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          const { type, nextIDIndex, perPage } = store;
          return repository.getStories(type(), nextIDIndex(), perPage()).pipe(
            catchError(() => {
              patchState(store, { isLoading: false, error: 'Failed to load stories.' });
              return EMPTY;
            }),
          );
        }),
        tap(({ stories, totalIDs, nextIDIndex }) =>
          patchState(store, (state) => ({
            ...state,
            totalIDs,
            nextIDIndex,
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
      if (!store.canLoadMore()) return;
      store.loadStories();
    },
  })),
);
