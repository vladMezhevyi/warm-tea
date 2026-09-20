import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewsHeaderComponent } from '../../components/news-header/news-header.component';

@Component({
  selector: 'mv-news-layout',
  imports: [RouterOutlet, NewsHeaderComponent],
  template: `
    <mv-news-header />

    <main class="main">
      <router-outlet />
    </main>
  `,
  styleUrl: './news-layout.component.scss',
})
export class NewsLayoutComponent {}
