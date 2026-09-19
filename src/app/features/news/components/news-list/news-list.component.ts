import { Component, computed, input, output } from '@angular/core';
import { Story } from '../../api/news.model';
import { StoryCardComponent } from '../story-card/story-card.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';

@Component({
  selector: 'mv-news-list',
  imports: [StoryCardComponent, SkeletonComponent, ButtonDirective],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss',
})
export class NewsListComponent {
  readonly stories = input<Story[]>([]);
  readonly isLoading = input<boolean>(false);
  readonly perPage = input<number>(25);
  readonly atLimit = input<boolean>(false);

  readonly loadMore = output<void>();

  protected readonly skeletonItems = computed<number[]>(() =>
    Array.from({ length: this.perPage() }, (_, i) => i),
  );
}
