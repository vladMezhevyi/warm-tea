import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/pages/page-not-found/page-not-found.component';
import { FullScreenLayoutComponent } from './shared/layouts/full-screen-layout/full-screen-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'news',
    pathMatch: 'full',
  },
  {
    path: 'news',
    loadChildren: () => import('./features/news/news.routes').then((r) => r.NEWS_ROUTES),
  },
  {
    path: '',
    component: FullScreenLayoutComponent,
    children: [
      {
        path: '**',
        component: PageNotFoundComponent,
      },
    ],
  },
];
