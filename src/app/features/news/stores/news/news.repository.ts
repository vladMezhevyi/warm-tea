import { inject, Injectable, Injector, Type } from '@angular/core';
import { StoryType } from './news.store';
import {
  catchError,
  EMPTY,
  expand,
  forkJoin,
  last,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  BestStoriesStrategy,
  NewStoriesStrategy,
  StoryStrategy,
  TopStoriesStrategy,
} from './story.strategy';
import { Story } from '../../api/news.model';
import { NewsApi } from '../../api/news.api';

interface GetStoriesResponse {
  stories: Story[];
  totalIDs: number;
  nextIDIndex: number;
}

@Injectable()
export class NewsRepository {
  private readonly injector = inject(Injector);
  private readonly api = inject(NewsApi);

  private readonly strategies: Record<StoryType, Type<StoryStrategy>> = {
    new: NewStoriesStrategy,
    top: TopStoriesStrategy,
    best: BestStoriesStrategy,
  };

  private readonly cache = new Map<StoryType, number[]>();

  getStories(type: StoryType, start: number, count: number): Observable<GetStoriesResponse> {
    return this.getIDs(type).pipe(
      switchMap((ids) =>
        of({ cursor: start, collected: [] as Story[], failedCount: 0 }).pipe(
          expand(({ cursor, collected, failedCount }) => {
            if (failedCount >= 3) {
              return throwError(() => new Error('Too many failed attempts while loading stories.'));
            }

            const needed = count - collected.length;
            if (needed <= 0 || cursor >= ids.length) return EMPTY;

            const chunk = ids.slice(cursor, cursor + needed);

            return forkJoin(
              chunk.map((id) =>
                this.api.getStory(id).pipe(
                  map((story) => ({ ok: true, story })),
                  catchError(() => of({ ok: false, story: null })),
                ),
              ),
            ).pipe(
              map((results) => {
                const anyFailed = results.some((result) => !result.ok);
                const validStories = results
                  .filter((result) => result.ok && result.story !== null)
                  .map((result) => result.story!);

                return {
                  cursor: cursor + chunk.length,
                  collected: [...collected, ...validStories],
                  failedCount: anyFailed ? failedCount + 1 : 0,
                };
              }),
            );
          }),
          last(),
          map(({ collected, cursor }) => ({
            stories: collected,
            totalIDs: ids.length,
            nextIDIndex: cursor,
          })),
        ),
      ),
    );
  }

  private getIDs(type: StoryType): Observable<number[]> {
    const cachedIDs = this.cache.get(type);
    if (this.cache.has(type) && cachedIDs?.length) {
      return of(cachedIDs);
    }

    const strategy = this.injector.get(this.strategies[type]);
    return strategy.getIDs().pipe(tap((ids) => this.cache.set(type, ids)));
  }
}
