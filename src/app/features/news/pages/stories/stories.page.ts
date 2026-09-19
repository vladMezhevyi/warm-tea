import { Component, effect, inject } from '@angular/core';
import { NewsStore } from '../../data/news.store';
import { NewsRepository } from '../../data/news.repository';

@Component({
  selector: 'mv-stories',
  imports: [],
  providers: [NewsRepository, NewsStore],
  templateUrl: './stories.page.html',
  styleUrl: './stories.page.scss',
})
export class StoriesPage {
  private readonly store = inject(NewsStore);

  constructor() {
    effect(() => console.log({ items: this.store.items() }));

    this.store.loadItems();
  }
}
