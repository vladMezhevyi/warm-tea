import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesPage } from './stories.page';

describe('StoriesPage', () => {
  let component: StoriesPage;
  let fixture: ComponentFixture<StoriesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoriesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(StoriesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
