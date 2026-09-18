import { Routes } from '@angular/router';

export const NEWS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/news-layout/news-layout.component').then((c) => c.NewsLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/news/news.component').then((c) => c.NewsComponent),
      },
    ],
  },
];
