import { Component, computed, inject } from '@angular/core';
import { NewsStore, StoryType } from '../../stores/news/news.store';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';

interface TabItem {
  label: string;
  type: StoryType;
  active: boolean;
}

@Component({
  selector: 'mv-news-tabs',
  imports: [ButtonDirective],
  templateUrl: './news-tabs.component.html',
  styleUrl: './news-tabs.component.scss',
})
export class NewsTabsComponent {
  private readonly store = inject(NewsStore);

  protected readonly tabItems = computed<TabItem[]>(() => {
    const items: TabItem[] = [
      { label: 'New', type: 'new', active: false },
      { label: 'Top', type: 'top', active: false },
      { label: 'Best', type: 'best', active: false },
    ];

    return items.map((item) => ({ ...item, active: item.type === this.store.type() }));
  });

  protected onTabClick(type: StoryType): void {
    this.store.updateType(type);
  }
}
