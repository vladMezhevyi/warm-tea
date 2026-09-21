import { Component, input, output } from '@angular/core';
import { NewsNavItem } from '../../services/news-navigation/news-navigation.service';
import { NewsNavItemComponent } from '../news-nav-item/news-nav-item.component';

@Component({
  selector: 'mv-news-nav-list',
  imports: [NewsNavItemComponent],
  templateUrl: './news-nav-list.component.html',
  styleUrl: './news-nav-list.component.scss',
  host: {
    '[class]': 'orientation()',
  },
})
export class NewsNavListComponent {
  readonly navItems = input.required<NewsNavItem[]>();
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  readonly linkClick = output<Event>();
}
