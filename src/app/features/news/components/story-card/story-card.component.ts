import { Component, input } from '@angular/core';
import { Story } from '../../api/news.model';

@Component({
  selector: 'mv-story-card',
  imports: [],
  templateUrl: './story-card.component.html',
  styleUrl: './story-card.component.scss',
})
export class StoryCardComponent {
  readonly story = input.required<Story>();
}
