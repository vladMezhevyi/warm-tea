import { inject, Injectable } from '@angular/core';
import { SidenavRef, SidenavService } from '../../../../shared/services/sidenav/sidenav.service';
import { NewsSidenavComponent } from '../../components/news-sidenav/news-sidenav.component';
import { take } from 'rxjs';

export interface NewsNavItem {
  label: string;
  route: string;
}

@Injectable({
  providedIn: 'root',
})
export class NewsNavigationService {
  private readonly sidenav = inject(SidenavService);

  private sidenavRef: SidenavRef | null = null;

  readonly navItems: NewsNavItem[] = [
    {
      route: '/new',
      label: 'New',
    },
    {
      route: '/top',
      label: 'Top',
    },
    {
      route: '/best',
      label: 'Best',
    },
    {
      route: '/ask',
      label: 'Ask',
    },
    {
      route: '/show',
      label: 'Show',
    },
    {
      route: '/jobs',
      label: 'Jobs',
    },
  ];

  openSidenav(): void {
    if (this.sidenavRef) return;

    this.sidenavRef = this.sidenav.open(NewsSidenavComponent, { side: 'right' });

    this.sidenavRef.closed.pipe(take(1)).subscribe(() => {
      this.sidenavRef = null;
    });
  }

  closeSidenav(): void {
    if (!this.sidenavRef) return;

    this.sidenavRef.close();
    this.sidenavRef = null;
  }
}
