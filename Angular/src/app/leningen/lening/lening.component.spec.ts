import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeningComponent } from './lening.component';

describe('LeningComponent', () => {
  let component: LeningComponent;
  let fixture: ComponentFixture<LeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
