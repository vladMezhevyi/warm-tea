import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsTabsComponent } from './news-tabs.component';

describe('NewsTabsComponent', () => {
  let component: NewsTabsComponent;
  let fixture: ComponentFixture<NewsTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsTabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsTabsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
