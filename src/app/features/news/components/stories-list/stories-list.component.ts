import { Component, computed, input, output } from '@angular/core';
import { NewsItem } from '../../api/news.model';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'mv-stories-list',
  imports: [SkeletonComponent, ButtonDirective, IconComponent],
  templateUrl: './stories-list.component.html',
  styleUrl: './stories-list.component.scss',
})
export class StoriesListComponent {
  readonly items = input.required<NewsItem[]>();
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
