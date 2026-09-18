import { Component, computed, effect, inject } from '@angular/core';
import { NewsStore, StoryType } from '../../stores/news/news.store';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';
import { NewsTabsComponent } from '../../components/news-tabs/news-tabs.component';
import { StoryCardComponent } from '../../components/story-card/story-card.component';
import { NewsRepository } from '../../stores/news/news.repository';

@Component({
  selector: 'mv-news',
  imports: [ButtonDirective, NewsTabsComponent, StoryCardComponent],
  providers: [NewsRepository, NewsStore],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {
  private readonly store = inject(NewsStore);

  protected readonly stories = this.store.stories;
  protected readonly isLoading = this.store.isLoading;
  protected readonly perPage = this.store.perPage;
  protected readonly canLoadMore = this.store.canLoadMore;

  protected readonly skeletonItems = computed<number[]>(() =>
    Array.from({ length: this.perPage() }, (_, i) => i),
  );

  constructor() {
    effect(() =>
      console.log({
        isLoading: this.store.isLoading(),
        stories: this.store.stories(),
      }),
    );

    this.store.loadStories();
  }

  protected updateType(type: StoryType): void {
    this.store.updateType(type);
  }

  protected loadMore(): void {
    this.store.loadMore();
  }
}
