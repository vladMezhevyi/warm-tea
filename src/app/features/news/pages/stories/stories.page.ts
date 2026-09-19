import { Component, computed, effect, inject } from '@angular/core';
import { NewsStore } from '../../data/news.store';
import { NewsRepository } from '../../data/news.repository';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
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
  protected readonly items = this.store.items;
  protected readonly perPage = this.store.perPage;
  protected readonly canLoadMore = this.store.canLoadMore;
  protected readonly reachedEnd = this.store.reachedEnd;
  protected readonly isEmpty = this.store.isEmpty;

  constructor() {
    effect(() => console.log({ items: this.store.items() }));

    this.store.loadItems();
  }

  protected loadMore(): void {
    this.store.loadMore();
  }
}
