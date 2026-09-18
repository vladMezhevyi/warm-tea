import { computed, Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: 'button[mvButton], a[mvButton]',
  host: {
    class: 'mv-button',
    '[attr.disabled]': 'buttonDisabled()',
    '[attr.aria-disabled]': 'anchorDisabled()',
    '[attr.tabindex]': 'anchorTabIndex()',
    '(click)': 'onClick($event)',
  },
})
export class ButtonDirective {
  private readonly el = inject<ElementRef<HTMLButtonElement | HTMLAnchorElement>>(ElementRef);

  readonly disabled = input<boolean>(false);

  private readonly isAnchor = this.el.nativeElement.tagName === 'A';

  protected readonly anchorDisabled = computed<string | null>(() =>
    this.isAnchor && this.disabled() ? 'true' : null,
  );

  protected readonly buttonDisabled = computed<boolean | null>(() =>
    !this.isAnchor && this.disabled() ? true : null,
  );

  protected readonly anchorTabIndex = computed<string | null>(() =>
    this.anchorDisabled() ? '-1' : null,
  );

  protected onClick(e: Event): void {
    if (!this.isAnchor || !this.disabled()) return;

    e.preventDefault();
    e.stopImmediatePropagation();
  }
}
