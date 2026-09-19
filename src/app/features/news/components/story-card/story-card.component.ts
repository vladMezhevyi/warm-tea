import { Component, computed, input } from '@angular/core';
import { Story } from '../../api/news.model';
import { timeAgo } from '../../../../shared/utils/time-ago';
import { ReadMoreComponent } from '../../../../shared/components/read-more/read-more.component';

@Component({
  selector: 'mv-story-card',
  imports: [ReadMoreComponent],
  templateUrl: './story-card.component.html',
  styleUrl: './story-card.component.scss',
})
export class StoryCardComponent {
  readonly story = input.required<Story>();

  protected readonly urlHostname = computed<string | null>(() => {
    const url = this.story().url;
    if (!url) return null;

    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return null;
    }
  });

  protected readonly scoreText = computed<string | null>(() => {
    const score = this.story().score;
    if (typeof score !== 'number') return null;

    const point = score === 1 ? 'point' : 'points';
    return `${score} ${point}`;
  });

  protected readonly commentsText = computed<string | null>(() => {
    const kids = this.story().kids?.length;
    if (!kids) return null;

    const comment = kids === 1 ? 'comment' : 'comments';
    return `${kids} ${comment}`;
  });

  protected readonly resolvedTime = computed<string | null>(() => {
    const time = this.story().time;
    return time ? timeAgo(new Date(time * 1000)) : null;
  });
}
