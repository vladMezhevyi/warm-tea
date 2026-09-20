import { Routes } from '@angular/router';
import { FullScreenLayoutComponent } from './shared/layouts/full-screen-layout/full-screen-layout.component';
import { PageNotFoundPage } from './shared/pages/page-not-found/page-not-found.page';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/news/news.routes').then((r) => r.NEWS_ROUTES),
  },
  {
    path: '',
    component: FullScreenLayoutComponent,
    children: [
      {
        path: '**',
        component: PageNotFoundPage,
      },
    ],
  },
];
