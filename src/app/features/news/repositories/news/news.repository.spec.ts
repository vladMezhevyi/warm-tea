import { TestBed } from '@angular/core/testing';
import { GetStoriesResponse, NewsRepository } from './news.repository';
import { NEWS_STRATEGY } from '../../tokens/news-strategy.token';
import { NewsStrategy } from '../../data/news.strategy';
import { of, take, throwError } from 'rxjs';
import { Mocked } from 'vitest';
import { createArray, createStory } from '../../testing/news-testing.helpers';

describe('NewsRepository', () => {
  let repository: NewsRepository;
  let strategy: Mocked<NewsStrategy>;

  beforeEach(() => {
    strategy = {
      getIDs: vi.fn(),
      getStory: vi.fn().mockImplementation((id) => of(createStory(id))),
    };

    TestBed.configureTestingModule({
      providers: [NewsRepository, { provide: NEWS_STRATEGY, useValue: strategy }],
    });

    repository = TestBed.inject(NewsRepository);
  });

  it('should create the service', () => {
    expect(repository).toBeDefined();
  });

  it('should fetch the requested amount of stories', () => {
    const ids = createArray(5);
    let response!: GetStoriesResponse;

    strategy.getIDs.mockReturnValue(of(ids));

    repository
      .getStories(0, 3)
      .pipe(take(1))
      .subscribe((res) => (response = res));

    expect(response.stories).toEqual([createStory(1), createStory(2), createStory(3)]);
    expect(response.totalIDs).toBe(5);
    expect(response.nextIDIndex).toBe(3);
  });

  it('should cache the ID list so getIDs is only called once across two requests', () => {
    const ids = createArray(3);

    strategy.getIDs.mockReturnValue(of(ids));

    repository.getStories(0, 1).pipe(take(1)).subscribe();
    repository.getStories(1, 2).pipe(take(1)).subscribe();

    expect(strategy.getIDs).toHaveBeenCalledOnce();
  });

  it('should return incomplete list when cursor reaches the end of ID list', () => {
    const ids = createArray(5);
    let response!: GetStoriesResponse;

    strategy.getIDs.mockReturnValue(of(ids));

    repository
      .getStories(3, 10)
      .pipe(take(1))
      .subscribe((res) => (response = res));

    expect(response.stories).toEqual([createStory(4), createStory(5)]);
    expect(response.totalIDs).toBe(5);
    expect(response.nextIDIndex).toBe(5);
  });

  it('should not drop single batch failure and fetch more stories', () => {
    const ids = createArray(5);
    const failureId = 2;
    let response!: GetStoriesResponse;

    strategy.getIDs.mockReturnValue(of(ids));
    strategy.getStory.mockImplementation((id) => {
      if (id === failureId) {
        return throwError(() => new Error(`Failed to load a story with ${failureId} id`));
      }

      return of(createStory(id));
    });

    repository
      .getStories(0, 3)
      .pipe(take(1))
      .subscribe((res) => (response = res));

    expect(response.stories).toEqual([createStory(1), createStory(3), createStory(4)]);
    expect(response.totalIDs).toBe(5);
    expect(response.nextIDIndex).toBe(4);
  });

  it('should throw an error after 3 fully-failed batches', () => {
    const ids = createArray(20);
    let response!: GetStoriesResponse;
    let error!: Error;

    strategy.getIDs.mockReturnValue(of(ids));
    strategy.getStory.mockImplementation(() => throwError(() => new Error('Failed story')));

    repository
      .getStories(0, 5)
      .pipe(take(1))
      .subscribe({
        next: (res) => (response = res),
        error: (err) => (error = err),
      });

    expect(response).toBeUndefined();
    expect(error).toBeInstanceOf(Error);
  });

  it('should ignore nulls and fetch more stories until it reaches the required amount', () => {
    const ids = createArray(10);
    let response!: GetStoriesResponse;

    strategy.getIDs.mockReturnValue(of(ids));
    strategy.getStory.mockImplementation((id) => {
      if (id === 2 || id === 4) {
        return of(null);
      }

      return of(createStory(id));
    });

    repository
      .getStories(0, 4)
      .pipe(take(1))
      .subscribe((res) => (response = res));

    expect(response.stories).toEqual([
      createStory(1),
      createStory(3),
      createStory(5),
      createStory(6),
    ]);
    expect(response.totalIDs).toBe(10);
    expect(response.nextIDIndex).toBe(6);
  });
});
