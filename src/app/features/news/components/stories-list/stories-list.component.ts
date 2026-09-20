import { Component, computed, input, output } from '@angular/core';
import { Story } from '../../api/news.model';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { StoryCardComponent } from '../story-card/story-card.component';
import { InfiniteScrollDirective } from '../../../../shared/directives/infinite-scroll/infinite-scroll.directive';

@Component({
  selector: 'mv-stories-list',
  imports: [SkeletonComponent, IconComponent, StoryCardComponent, InfiniteScrollDirective],
  templateUrl: './stories-list.component.html',
  styleUrl: './stories-list.component.scss',
})
export class StoriesListComponent {
  readonly stories = input.required<Story[]>();
  readonly perPage = input.required<number>();
  readonly isLoading = input<boolean>(false);
  readonly isEmpty = input<boolean>(false);
  readonly reachedEnd = input<boolean>(false);
  readonly canLoadMore = input<boolean>(false);
  readonly error = input<string | null>(null);

  readonly loadMore = output<void>();

  protected readonly skeletonItems = computed<number[]>(() =>
    Array.from({ length: this.perPage() }, (_, i) => i),
  );
}
