import { inject, Injectable } from '@angular/core';
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
import { NEWS_STRATEGY } from './news-strategy.token';
import { NewsItem } from '../api/news.model';

interface GetStoriesResponse {
  items: NewsItem[];
  totalIDs: number;
  nextIDIndex: number;
}

@Injectable()
export class NewsRepository {
  private readonly strategy = inject(NEWS_STRATEGY);

  private cache: number[] | null = null;

  getItems(start: number, count: number): Observable<GetStoriesResponse> {
    return this.getIDs().pipe(
      switchMap((ids) =>
        of({ cursor: start, collected: [] as NewsItem[], failedCount: 0 }).pipe(
          expand(({ cursor, collected, failedCount }) => {
            if (failedCount >= 3) {
              return throwError(() => new Error('Too many failed attempts while loading stories.'));
            }

            const needed = count - collected.length;
            if (needed <= 0 || cursor >= ids.length) return EMPTY;

            const chunk = ids.slice(cursor, cursor + needed);

            return forkJoin(
              chunk.map((id) =>
                this.strategy.getItem(id).pipe(
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
            items: collected,
            totalIDs: ids.length,
            nextIDIndex: cursor,
          })),
        ),
      ),
    );
  }

  private getIDs(): Observable<number[]> {
    if (this.cache?.length) return of(this.cache);
    return this.strategy.getIDs().pipe(tap((ids) => (this.cache = ids)));
  }
}
