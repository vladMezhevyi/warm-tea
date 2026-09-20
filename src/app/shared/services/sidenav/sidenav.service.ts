import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { createGlobalPositionStrategy } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable, Injector } from '@angular/core';
import { Observable, take } from 'rxjs';
import { SidenavContainerComponent } from '../../components/sidenav-container/sidenav-container.component';

export interface SidenavConfig<D> {
  data?: D;
  side: 'left' | 'right';
  width: string;
  height: string;
  ariaLabel: string;
  disableClose: boolean;
}

export class SidenavRef<R = unknown> {
  readonly closed: Observable<R | undefined>;

  constructor(private readonly dialogRef: DialogRef<R>) {
    this.closed = dialogRef.closed;
  }

  close(result?: R): void {
    this.dialogRef.close(result);
  }
}

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private readonly dialog = inject(Dialog);
  private readonly injector = inject(Injector);

  open<C, D = unknown, R = unknown>(
    component: ComponentType<C>,
    config?: Partial<SidenavConfig<D>>,
  ): SidenavRef<R> {
    let sidenavRef!: SidenavRef<R>;
    const side: SidenavConfig<D>['side'] = config?.side ?? 'left';

    const dialogRef = this.dialog.open<R, D, C>(component, {
      data: config?.data,
      width: config?.width ?? 'var(--sidenav-width)',
      height: config?.height ?? 'var(--sidenav-height)',
      maxWidth: '100vw',
      ariaLabel: config?.ariaLabel ?? 'Sidenav',
      ariaModal: true,
      closeOnNavigation: true,
      disableClose: config?.disableClose ?? false,
      panelClass: ['mv-sidenav-panel', `mv-sidenav-panel-${side}`],
      backdropClass: 'mv-sidenav-backdrop',
      positionStrategy: createGlobalPositionStrategy(this.injector).top('0')[side]('0'),
      container: SidenavContainerComponent,
      providers: (ref) => {
        sidenavRef = new SidenavRef<R>(ref as DialogRef<R>);
        return [{ provide: SidenavRef, useValue: sidenavRef }];
      },
    });

    if (!config?.disableClose) {
      dialogRef.backdropClick.pipe(take(1)).subscribe(() => sidenavRef.close());
      dialogRef.keydownEvents.pipe(take(1)).subscribe((e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          sidenavRef.close();
        }
      });
    }

    return sidenavRef;
  }
}
