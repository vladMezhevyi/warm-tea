import { inject, Injectable, Injector, Type } from '@angular/core';
import { StoryType } from './news.store';
import { EMPTY, expand, forkJoin, last, map, Observable, of, switchMap, tap } from 'rxjs';
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

  getStories(
    type: StoryType,
    firstIndex: number,
    lastIndex: number,
  ): Observable<GetStoriesResponse> {
    return this.getIDs(type).pipe(
      switchMap((ids) =>
        of({ cursor: firstIndex, collected: [] as Story[] }).pipe(
          expand(({ cursor, collected }) => {
            const needed = lastIndex - firstIndex - collected.length;
            if (needed <= 0 || cursor >= ids.length) return EMPTY;

            const chunk = ids.slice(cursor, cursor + needed);
            return forkJoin(chunk.map((id) => this.api.getStory(id))).pipe(
              map((stories) => ({
                cursor: cursor + chunk.length,
                collected: [...collected, ...stories.filter((story) => story !== null)],
              })),
            );
          }),
          last(),
          map(({ collected }) => ({ stories: collected, totalIDs: ids.length })),
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
