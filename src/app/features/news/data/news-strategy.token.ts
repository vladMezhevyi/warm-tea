import { InjectionToken, Provider, Type } from '@angular/core';
import { NewsStrategy } from './news.strategy';

export const NEWS_STRATEGY = new InjectionToken<NewsStrategy>('NEWS_STRATEGY');

export const provideNewsStrategy = (strategy: Type<NewsStrategy>): Provider => ({
  provide: NEWS_STRATEGY,
  useClass: strategy,
});
