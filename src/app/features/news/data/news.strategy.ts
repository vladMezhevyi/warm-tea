import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsApi } from '../api/news.api';
import { Story } from '../api/news.model';

export interface NewsStrategy {
  getIDs(): Observable<number[]>;
  getStory(id: number): Observable<Story | null>;
}

export abstract class NewsStrategyBase implements NewsStrategy {
  protected readonly api = inject(NewsApi);

  abstract getIDs(): Observable<number[]>;

  getStory(id: number): Observable<Story | null> {
    return this.api.getStory(id);
  }
}

@Injectable({
  providedIn: 'root',
})
export class NewStoriesStrategy extends NewsStrategyBase {
  getIDs(): Observable<number[]> {
    return this.api.getNewStories();
  }
}

@Injectable({
  providedIn: 'root',
})
export class TopStoriesStrategy extends NewsStrategyBase {
  getIDs(): Observable<number[]> {
    return this.api.getTopStories();
  }
}

@Injectable({
  providedIn: 'root',
})
export class BestStoriesStrategy extends NewsStrategyBase {
  getIDs(): Observable<number[]> {
    return this.api.getBestStories();
  }
}

@Injectable({
  providedIn: 'root',
})
export class AskStoriesStrategy extends NewsStrategyBase {
  getIDs(): Observable<number[]> {
    return this.api.getAskStories();
  }
}

@Injectable({
  providedIn: 'root',
})
export class ShowStoriesStrategy extends NewsStrategyBase {
  getIDs(): Observable<number[]> {
    return this.api.getShowStories();
  }
}

@Injectable({
  providedIn: 'root',
})
export class JobStoriesStrategy extends NewsStrategyBase {
  getIDs(): Observable<number[]> {
    return this.api.getJobStories();
  }
}
