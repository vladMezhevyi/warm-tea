import { DOCUMENT, inject, Injectable, Renderer2, RendererFactory2, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly body = inject(DOCUMENT).body;
  private readonly renderer: Renderer2;

  private readonly themeKey = 'theme';
  private readonly themesSet = new Set<Theme>(['dark', 'light']);
  private readonly prefersDarkScheme = '(prefers-color-scheme: dark)';

  private readonly _currentTheme = signal<Theme>('light');
  readonly currentTheme = this._currentTheme.asReadonly();

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  setTheme(theme: Theme): void {
    this._currentTheme.set(theme);
    this.applyTheme(theme);
    this.saveTheme(theme);
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme() === 'dark' ? 'light' : 'dark');
  }

  init(): void {
    const savedTheme = this.getSavedTheme();
    const prefersDark = window.matchMedia(this.prefersDarkScheme).matches;

    const initialTheme = savedTheme ?? (prefersDark ? 'dark' : 'light');
    this.setTheme(initialTheme);

    window.matchMedia(this.prefersDarkScheme).addEventListener('change', (e) => {
      if (savedTheme) return;
      this.setTheme(e.matches ? 'dark' : 'light');
    });
  }

  private applyTheme(theme: Theme): void {
    this.themesSet.forEach((t) => this.renderer.removeClass(this.body, t));
    this.renderer.addClass(this.body, theme);
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.themeKey, theme);
  }

  private getSavedTheme(): Theme | null {
    const theme = localStorage.getItem(this.themeKey)?.trim() as Theme | undefined;

    if (theme && this.themesSet.has(theme)) {
      return theme;
    }

    this.clearSavedTheme();
    return null;
  }

  private clearSavedTheme(): void {
    localStorage.removeItem(this.themeKey);
  }
}
