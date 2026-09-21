import { Routes } from '@angular/router';
import { provideNewsStrategy } from './tokens/news-strategy.token';
import {
  AskStoriesStrategy,
  BestStoriesStrategy,
  JobStoriesStrategy,
  NewsStrategy,
  NewStoriesStrategy,
  ShowStoriesStrategy,
  TopStoriesStrategy,
} from './strategies/news.strategy';
import { Type } from '@angular/core';

interface StoryRoute {
  path: string;
  title: string;
  strategy: Type<NewsStrategy>;
}

const STORY_ROUTES_CONFIG: StoryRoute[] = [
  {
    path: 'new',
    title: 'New',
    strategy: NewStoriesStrategy
  },
  {
    path: 'top',
    title: 'Top',
    strategy: TopStoriesStrategy
  },
  {
    path: 'best',
    title: 'Best',
    strategy: BestStoriesStrategy
  },
  {
    path: 'ask',
    title: 'Ask',
    strategy: AskStoriesStrategy
  },
  {
    path: 'show',
    title: "Show",
    strategy: ShowStoriesStrategy
  },
  {
    path: 'jobs',
    title: 'Jobs',
    strategy: JobStoriesStrategy
  }
]

const provideStoryRoutes = (): Routes => {
  return STORY_ROUTES_CONFIG.map(({path, title, strategy}) => ({
    path,
    title: `${title} | MV News`,
    loadComponent: () => import('./pages/stories/stories.page').then((c) => c.StoriesPage),
    providers: [provideNewsStrategy(strategy)]
  }))
}

export const NEWS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/news-layout/news-layout.component').then((c) => c.NewsLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'new',
        pathMatch: 'full'
      },
      ...provideStoryRoutes()
    ]
  },
];
