import { Routes } from '@angular/router';
import { provideNewsStrategy } from './tokens/news-strategy.token';
import {
  AskStoriesStrategy,
  BestStoriesStrategy,
  JobStoriesStrategy,
  NewStoriesStrategy,
  ShowStoriesStrategy,
  TopStoriesStrategy,
} from './strategies/news.strategy';

export const NEWS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/news-layout/news-layout.component').then((c) => c.NewsLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'new',
        pathMatch: 'full',
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/stories/stories.page').then((c) => c.StoriesPage),
        providers: [provideNewsStrategy(NewStoriesStrategy)],
      },
      {
        path: 'top',
        loadComponent: () => import('./pages/stories/stories.page').then((c) => c.StoriesPage),
        providers: [provideNewsStrategy(TopStoriesStrategy)],
      },
      {
        path: 'best',
        loadComponent: () => import('./pages/stories/stories.page').then((c) => c.StoriesPage),
        providers: [provideNewsStrategy(BestStoriesStrategy)],
      },
      {
        path: 'ask',
        loadComponent: () => import('./pages/stories/stories.page').then((c) => c.StoriesPage),
        providers: [provideNewsStrategy(AskStoriesStrategy)],
      },
      {
        path: 'show',
        loadComponent: () => import('./pages/stories/stories.page').then((c) => c.StoriesPage),
        providers: [provideNewsStrategy(ShowStoriesStrategy)],
      },
      {
        path: 'jobs',
        loadComponent: () => import('./pages/stories/stories.page').then((c) => c.StoriesPage),
        providers: [provideNewsStrategy(JobStoriesStrategy)],
      },
    ],
  },
];
