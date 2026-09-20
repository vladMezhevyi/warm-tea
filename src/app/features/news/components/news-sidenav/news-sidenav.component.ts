import { Component, inject } from '@angular/core';
import { NewsNavigationService } from '../../services/news-navigation/news-navigation.service';
import { NewsNavItemComponent } from '../news-nav-item/news-nav-item.component';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'mv-news-sidenav',
  imports: [NewsNavItemComponent, ButtonDirective, IconComponent],
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
