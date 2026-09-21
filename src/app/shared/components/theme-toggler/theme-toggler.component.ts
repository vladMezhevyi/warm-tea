import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';
import { ButtonDirective } from '../../directives/button/button.directive';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'mv-theme-toggler',
  imports: [ButtonDirective, IconComponent],
  template: `
    <button mvButton iconOnly role="switch" [attr.aria-checked]="isDark() ? 'true' : undefined" [attr.aria-label]="label()" (click)="onToggle()">
      <mv-icon [name]="icon()" />
    </button>
  `,
})
export class ThemeTogglerComponent {
  private readonly themeService = inject(ThemeService);

  protected readonly isDark = computed<boolean>(() => this.themeService.currentTheme() === 'dark');

  protected readonly icon = computed<string>(() => (this.isDark() ? 'sun' : 'moon'));

  protected readonly label = computed<string>(
    () => `Switch to ${this.isDark() ? 'light' : 'dark'} theme`,
  );

  protected onToggle(): void {
    this.themeService.toggleTheme();
  }
}
