import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesViewComponent } from './fees-view.component';

describe('FeesViewComponent', () => {
  let component: FeesViewComponent;
  let fixture: ComponentFixture<FeesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
