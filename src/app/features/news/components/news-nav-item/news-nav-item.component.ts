import { Component, input, output } from '@angular/core';
import { NewsNavItem } from '../../services/news-navigation/news-navigation.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'mv-news-nav-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './news-nav-item.component.html',
  styleUrl: './news-nav-item.component.scss',
})
export class NewsNavItemComponent {
  readonly item = input.required<NewsNavItem>();
  readonly size = input<'md' | 'lg'>('md');

  readonly linkClick = output<Event>();
}
