import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewsHeaderComponent } from '../../components/news-header/news-header.component';

@Component({
  selector: 'mv-news-layout',
  imports: [RouterOutlet, NewsHeaderComponent],
  templateUrl: './news-layout.component.html',
  styleUrl: './news-layout.component.scss',
})
export class NewsLayoutComponent {}
