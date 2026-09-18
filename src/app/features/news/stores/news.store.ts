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
import { EMPTY, expand, forkJoin, last, map, Observable, of, pipe, switchMap, tap } from 'rxjs';

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
  last: 10,
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
        /*
          getStory method returns Story object or null, and having nulls in array will lead to inconsistent UI.
          To fix this issue after fetching stories (using forkJoin) we filter out null values,
          and recursivelly fetch next objects (using expand) until we meet the required amount of objects.

          Example: 
          The logic starts with values:
          first = 10
          last = 20

          1. On the first iteration, needed variable is 10 (20 - 10 - 0 = 10).
             It makes 10 requests (using forkJoin), and 3 of them return nulls instead of objects;
          2. On the second iteration it calculates needed variable again (20 - 10 - 7 = 3), 
             so it needs to fetch 3 more objects. It makes 3 requests and all of them return valid objects;
          3. On the third iteration it calculates needed variable again (20 - 10 - 10 = 0),
             so it means we collected required amount of objects and can stop recursion.
        */
        switchMap((ids) =>
          of({ cursor: store.first(), collected: [] as Story[] }).pipe(
            expand(({ cursor, collected }) => {
              const needed = store.last() - store.first() - collected.length;
              if (needed <= 0 || cursor >= ids.length) return EMPTY;

              const chunk = ids.slice(cursor, cursor + needed);
              return forkJoin(chunk.map((id) => api.getStory(id))).pipe(
                map((stories) => {
                  return {
                    cursor: cursor + chunk.length,
                    collected: [...collected, ...stories.filter((story) => story !== null)],
                  };
                }),
              );
            }),
            last(),
            map(({ collected }) => collected),
          ),
        ),
        tap((nextStories) =>
          patchState(store, (state) => ({
            ...state,
            isLoading: false,
            stories: [...state.stories, ...nextStories],
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
      const last = first + 10;

      patchState(store, { first, last });
      store.loadStories();
    },
  })),
);
