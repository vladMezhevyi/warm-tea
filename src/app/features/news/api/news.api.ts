import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from './news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsApi {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.newsApiUrl;

  getTopStories(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/topstories.json`);
  }

  getNewStories(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/newstories.json`);
  }

  getBestStories(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/beststories.json`);
  }

  getStory(id: number): Observable<Story> {
    return this.http.get<Story>(`${this.apiUrl}/item/${id}.json`);
  }

  getMaxItemID(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/maxitem.json`);
  }
}
