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
import { NewsRepository } from './news.repository';
import { NewsItem } from '../api/news.model';

interface NewsState {
  items: NewsItem[];
  totalIDs: number;
  isLoading: boolean;
  perPage: number;
  nextIDIndex: number;
  error: string | null;
}

const initialState: NewsState = {
  perPage: 25,
  items: [],
  totalIDs: 0,
  isLoading: false,
  nextIDIndex: 0,
  error: null,
};

export const NewsStore = signalStore(
  withState(initialState),

  withProps(() => ({ repository: inject(NewsRepository) })),

  withComputed(({ totalIDs, items, error, isLoading }) => ({
    canLoadMore: computed<boolean>(() => items().length < totalIDs()),
    isEmpty: computed<boolean>(() => !isLoading() && !error() && !items().length),
    reachedEnd: computed<boolean>(
      () => !isLoading() && items().length > 0 && items().length >= totalIDs(),
    ),
  })),

  withMethods(({ repository, ...store }) => ({
    loadItems: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          const { nextIDIndex, perPage } = store;
          return repository.getItems(nextIDIndex(), perPage()).pipe(
            catchError(() => {
              patchState(store, { isLoading: false, error: 'Failed to load stories.' });
              return EMPTY;
            }),
          );
        }),
        tap(({ items, totalIDs, nextIDIndex }) =>
          patchState(store, (state) => ({
            ...state,
            totalIDs,
            nextIDIndex,
            isLoading: false,
            items: [...state.items, ...items],
          })),
        ),
      ),
    ),
  })),

  withMethods((store) => ({
    loadMore: () => {
      store.loadItems();
    },
  })),
);
