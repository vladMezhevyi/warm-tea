import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '../../directives/button/button.directive';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'mv-page-not-found',
  imports: [RouterLink, ButtonDirective, IconComponent],
  templateUrl: './page-not-found.page.html',
  styleUrl: './page-not-found.page.scss',
})
export class PageNotFoundPage {}
