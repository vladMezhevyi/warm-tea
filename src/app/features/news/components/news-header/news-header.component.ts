import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { NewsNavigationService } from '../../services/news-navigation/news-navigation.service';
import { NewsNavItemComponent } from '../news-nav-item/news-nav-item.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'mv-news-header',
  imports: [RouterLink, ButtonDirective, IconComponent, NewsNavItemComponent],
  templateUrl: './news-header.component.html',
  styleUrl: './news-header.component.scss',
})
export class NewsHeaderComponent {
  private readonly navigation = inject(NewsNavigationService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly navItems = this.navigation.navItems;

  protected readonly showSidenav = toSignal<boolean>(
    this.breakpointObserver.observe(`(max-width: 585px)`).pipe(map((state) => state.matches)),
  );

  protected openSidenav(): void {
    this.navigation.openSidenav();
  }
}
