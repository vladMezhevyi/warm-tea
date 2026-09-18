import { Directive } from '@angular/core';

@Directive({
  selector: 'button[mvButton]',
  host: {
    class: 'mv-button',
  },
})
export class ButtonDirective {}
