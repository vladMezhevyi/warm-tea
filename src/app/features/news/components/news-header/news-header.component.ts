import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { NewsNavigationService } from '../../services/news-navigation/news-navigation.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ThemeTogglerComponent } from '../../../../shared/components/theme-toggler/theme-toggler.component';
import { NewsNavListComponent } from '../news-nav-list/news-nav-list.component';

@Component({
  selector: 'mv-news-header',
  imports: [
    ButtonDirective,
    IconComponent,
    ThemeTogglerComponent,
    NewsNavListComponent,
    RouterLink,
  ],
  templateUrl: './news-header.component.html',
  styleUrl: './news-header.component.scss',
  host: {
    '[class.mobile]': 'isMobile()',
  },
})
export class NewsHeaderComponent {
  private readonly navigation = inject(NewsNavigationService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly navItems = this.navigation.navItems;
  protected readonly sidenavOpened = this.navigation.sidenavOpened;

  protected readonly isMobile = toSignal<boolean>(
    this.breakpointObserver.observe(`(max-width: 768px)`).pipe(map((state) => state.matches)),
  );

  constructor() {
    effect(() => {
      if (!this.isMobile()) {
        this.navigation.closeSidenav();
      }
    });
  }

  protected openSidenav(): void {
    this.navigation.openSidenav();
  }
}
