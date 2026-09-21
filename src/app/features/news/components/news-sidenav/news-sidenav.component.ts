import { Component, inject } from '@angular/core';
import { NewsNavigationService } from '../../services/news-navigation/news-navigation.service';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { NewsNavListComponent } from '../news-nav-list/news-nav-list.component';

@Component({
  selector: 'mv-news-sidenav',
  imports: [ButtonDirective, IconComponent, NewsNavListComponent],
  templateUrl: './news-sidenav.component.html',
  styleUrl: './news-sidenav.component.scss',
})
export class NewsSidenavComponent {
  private readonly navigation = inject(NewsNavigationService);

  protected readonly navItems = this.navigation.navItems;

  protected close(): void {
    this.navigation.closeSidenav();
  }
}
