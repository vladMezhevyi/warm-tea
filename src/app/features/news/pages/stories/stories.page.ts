import { Component, inject } from '@angular/core';
import { NewsStore } from '../../data/news.store';
import { NewsRepository } from '../../data/news.repository';
import { StoriesListComponent } from '../../components/stories-list/stories-list.component';

@Component({
  selector: 'mv-stories',
  imports: [StoriesListComponent],
  providers: [NewsRepository, NewsStore],
  templateUrl: './stories.page.html',
  styleUrl: './stories.page.scss',
})
export class StoriesPage {
  private readonly store = inject(NewsStore);

  protected readonly error = this.store.error;
  protected readonly isLoading = this.store.isLoading;
  protected readonly stories = this.store.stories;
  protected readonly perPage = this.store.perPage;
  protected readonly canLoadMore = this.store.canLoadMore;
  protected readonly reachedEnd = this.store.reachedEnd;
  protected readonly isEmpty = this.store.isEmpty;

  constructor() {
    this.store.loadItems();
  }

  protected loadMore(): void {
    this.store.loadMore();
  }
}
