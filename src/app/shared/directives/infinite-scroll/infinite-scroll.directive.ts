import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';

@Directive({
  selector: '[mvInfiniteScroll]',
  host: {
    'aria-hidden': 'true',
  },
})
export class InfiniteScrollDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly rootMargin = input<string>('200px');

  readonly inView = output<void>();

  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender({ read: () => this.attachObserver() });

    this.destroyRef.onDestroy(() => this.disconnect());
  }

  private attachObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.inView.emit();
        }
      },
      {
        rootMargin: this.rootMargin(),
        threshold: 0,
      },
    );

    this.observer.observe(this.el.nativeElement);
  }

  private disconnect(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
