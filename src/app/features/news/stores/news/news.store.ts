import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { NewsRepository } from '../../repositories/news/news.repository';
import { Story } from '../../api/news.model';

interface NewsState {
  stories: Story[];
  totalIDs: number;
  isLoading: boolean;
  perPage: number;
  nextIDIndex: number;
  error: string | null;
}

const initialState: NewsState = {
  perPage: 25,
  stories: [],
  totalIDs: 0,
  isLoading: false,
  nextIDIndex: 0,
  error: null,
};

export const NewsStore = signalStore(
  withState(initialState),

  withProps(() => ({ repository: inject(NewsRepository) })),

  withComputed(({ totalIDs, stories, error, isLoading }) => ({
    canLoadMore: computed<boolean>(() => stories().length < totalIDs()),
    isEmpty: computed<boolean>(() => !isLoading() && !error() && !stories().length),
    reachedEnd: computed<boolean>(
      () => !isLoading() && stories().length > 0 && stories().length >= totalIDs(),
    ),
  })),

  withMethods(({ repository, ...store }) => ({
    loadStories: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          const { nextIDIndex, perPage } = store;
          return repository.getStories(nextIDIndex(), perPage()).pipe(
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
    loadMore: () => {
      store.loadStories();
    },
  })),
);
