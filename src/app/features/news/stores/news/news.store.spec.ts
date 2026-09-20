import { TestBed } from '@angular/core/testing';
import { NewsStore } from './news.store';
import { NewsRepository } from '../../repositories/news/news.repository';
import { of, throwError } from 'rxjs';
import { Mocked } from 'vitest';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { createArray, createStory } from '../../testing/news-testing.helpers';

describe('NewsStore', () => {
  let repository: Mocked<Pick<NewsRepository, 'getStories'>>;
  let store: InstanceType<typeof NewsStore>;

  beforeEach(() => {
    repository = {
      getStories: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [NewsStore, { provide: NewsRepository, useValue: repository }],
    });

    store = TestBed.inject(NewsStore);
  });

  it('is defined', () => {
    expect(store).toBeDefined();
  });

  it('starts with the initial state', () => {
    expect(store.stories()).toEqual([]);
    expect(store.totalIDs()).toBe(0);
    expect(store.isLoading()).toBe(false);
    expect(store.nextIDIndex()).toBe(0);
    expect(store.error()).toBeNull();
    expect(store.perPage()).toBe(25);
  });

  it('canLoadMore is true when there are less stories than totalIDs', () => {
    patchState(unprotected(store), { totalIDs: 5, stories: [createStory(1), createStory(2)] });
    expect(store.canLoadMore()).toBe(true);
  });

  it('canLoadMore is false when all stories have been loaded', () => {
    patchState(unprotected(store), { totalIDs: 2, stories: [createStory(1), createStory(2)] });
    expect(store.canLoadMore()).toBe(false);
  });

  it('isEmpty is true when not loading, no error, and zero stories available', () => {
    patchState(unprotected(store), { stories: [], isLoading: false, error: null });
    expect(store.isEmpty()).toBe(true);
  });

  it('reachedEnd is true when not loading, and stories length is equal to totalIDs', () => {
    patchState(unprotected(store), {
      stories: [createStory(1), createStory(2)],
      totalIDs: 2,
      isLoading: false,
    });
    expect(store.reachedEnd()).toBe(true);
  });

  it('reachedEnd is false when stories length is less than totalIDs, or when loading', () => {
    patchState(unprotected(store), {
      stories: [createStory(1), createStory(2)],
      totalIDs: 5,
      isLoading: false,
    });

    expect(store.reachedEnd()).toBe(false);

    patchState(unprotected(store), {
      stories: [createStory(1), createStory(2)],
      totalIDs: 2,
      isLoading: true,
    });

    expect(store.reachedEnd()).toBe(false);
  });

  describe('loadStories', () => {
    it('loads stories', () => {
      const ids = createArray(100);
      const stories = createArray(25).map((id) => createStory(id));

      repository.getStories.mockReturnValue(
        of({
          stories,
          totalIDs: ids.length,
          nextIDIndex: 25,
        }),
      );

      store.loadStories();

      expect(store.stories()).toEqual(stories);
      expect(store.totalIDs()).toBe(ids.length);
      expect(store.nextIDIndex()).toBe(25);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('throws an error', () => {
      const ids = createArray(4);
      const stories = createArray(2).map((id) => createStory(id));

      patchState(unprotected(store), {
        stories,
        totalIDs: ids.length,
        nextIDIndex: stories.length,
      });

      repository.getStories.mockReturnValue(throwError(() => new Error('Test error')));

      store.loadStories();

      expect(store.stories()).toEqual(stories);
      expect(store.totalIDs()).toBe(ids.length);
      expect(store.nextIDIndex()).toBe(stories.length);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBe('Failed to load stories.');
    });

    it('should paginate', () => {
      const ids = createArray(50);
      const stories = ids.map((id) => createStory(id));

      expect(store.stories()).toEqual([]);
      expect(store.totalIDs()).toBe(0);
      expect(store.nextIDIndex()).toBe(0);

      repository.getStories.mockImplementation((start, count) =>
        of({
          stories: stories.slice(start, start + count),
          totalIDs: ids.length,
          nextIDIndex: start + count,
        }),
      );

      store.loadStories();

      expect(store.stories()).toEqual(stories.slice(0, 25));
      expect(store.totalIDs()).toBe(50);
      expect(store.nextIDIndex()).toBe(25);

      store.loadStories();

      expect(store.stories()).toEqual(stories.slice(0, 50));
      expect(store.totalIDs()).toBe(50);
      expect(store.nextIDIndex()).toBe(50);
    });
  });
});
