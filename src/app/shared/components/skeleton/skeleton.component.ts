import { Component, computed, input } from '@angular/core';

type SkeletonShape = 'rectangle' | 'circle';

@Component({
  selector: 'mv-skeleton',
  template: '',
  styleUrl: './skeleton.component.scss',
  host: {
    class: 'mv-skeleton',
    'aria-hidden': 'true',
    '[style.--skeleton-width]': 'widthValue()',
    '[style.--skeleton-height]': 'heightValue()',
    '[style.--skeleton-radius]': 'radiusValue()',
  },
})
export class SkeletonComponent {
  readonly shape = input<SkeletonShape>('rectangle');
  readonly size = input<string>();
  readonly width = input<string>();
  readonly height = input<string>();
  readonly radius = input<string>();

  protected readonly widthValue = computed(() => this.size() ?? this.width() ?? null);
  protected readonly heightValue = computed(() => this.size() ?? this.height() ?? null);
  protected readonly radiusValue = computed(() =>
    this.shape() === 'circle' ? '50%' : (this.radius() ?? null),
  );
}
