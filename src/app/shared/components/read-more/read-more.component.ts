import { afterNextRender, Component, ElementRef, input, signal, viewChild } from '@angular/core';

let nextID = 0;

@Component({
  selector: 'mv-read-more',
  templateUrl: './read-more.component.html',
  styleUrl: './read-more.component.scss',
})
export class ReadMoreComponent {
  readonly text = input<string>('');
  readonly html = input<string>('');
  readonly maxLines = input<number>(3);
  readonly label = input<string | undefined>(undefined);

  private readonly contentRef = viewChild.required<ElementRef<HTMLElement>>('content');

  protected readonly isTruncated = signal<boolean>(false);
  protected readonly expanded = signal<boolean>(false);

  protected readonly contentID = `mv-read-more-${nextID++}`;

  constructor() {
    afterNextRender({
      read: () => {
        const el = this.contentRef().nativeElement;
        this.isTruncated.set(el.scrollHeight > el.clientHeight);
      },
    });
  }

  protected toggle(): void {
    this.expanded.update((prev) => !prev);
  }
}
