import { Component, computed, input } from '@angular/core';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'mv-icon',
  template: '',
  styleUrl: './icon.component.scss',
  host: {
    'aria-hidden': 'true',
    '[class]': 'iconClass()',
    '[style.--icon-size]': 'iconSize()',
  },
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input<IconSize>('md');

  protected readonly iconClass = computed<string>(() => `mv-icon ph ph-${this.name()}`);
  protected readonly iconSize = computed<string>(() => `var(--icon-size-${this.size()})`);
}
