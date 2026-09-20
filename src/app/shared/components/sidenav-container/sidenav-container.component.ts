import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mv-sidenav-container',
  imports: [CdkPortalOutlet],
  template: `<ng-template cdkPortalOutlet />`,
  styleUrl: './sidenav-container.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'mv-sidenav-container',
  },
})
export class SidenavContainerComponent extends CdkDialogContainer {}
