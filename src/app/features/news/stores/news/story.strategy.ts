import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsApi } from '../../api/news.api';

export abstract class StoryStrategy {
  protected readonly api = inject(NewsApi);

  abstract getIDs(): Observable<number[]>;
}

@Injectable({
  providedIn: 'root',
})
export class NewStoriesStrategy extends StoryStrategy {
  getIDs(): Observable<number[]> {
    return this.api.getNewStories();
  }
}

@Injectable({
  providedIn: 'root',
})
export class TopStoriesStrategy extends StoryStrategy {
  getIDs(): Observable<number[]> {
    return this.api.getTopStories();
  }
}

@Injectable({
  providedIn: 'root',
})
export class BestStoriesStrategy extends StoryStrategy {
  getIDs(): Observable<number[]> {
    return this.api.getBestStories();
  }
}
