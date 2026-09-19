import { Component, inject } from '@angular/core';
import { NewsStore, StoryType } from '../../stores/news/news.store';
import { NewsTabsComponent } from '../../components/news-tabs/news-tabs.component';
import { NewsRepository } from '../../stores/news/news.repository';
import { NewsListComponent } from '../../components/news-list/news-list.component';

@Component({
  selector: 'mv-news',
  imports: [NewsTabsComponent, NewsListComponent],
  providers: [NewsRepository, NewsStore],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {
  private readonly store = inject(NewsStore);

  protected readonly stories = this.store.stories;
  protected readonly isLoading = this.store.isLoading;
  protected readonly perPage = this.store.perPage;
  protected readonly error = this.store.error;
  protected readonly atLimit = this.store.atLimit;

  constructor() {
    this.store.loadStories();
  }

  protected updateType(type: StoryType): void {
    this.store.updateType(type);
  }

  protected loadMore(): void {
    this.store.loadMore();
  }
}
