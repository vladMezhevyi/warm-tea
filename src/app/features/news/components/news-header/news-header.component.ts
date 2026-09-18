import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'mv-news-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './news-header.component.html',
  styleUrl: './news-header.component.scss',
})
export class NewsHeaderComponent {
  protected readonly navItems: NavItem[] = [
    {
      route: '/',
      label: 'News',
    },
    {
      route: '/comments',
      label: 'Comments',
    },
  ];
}
