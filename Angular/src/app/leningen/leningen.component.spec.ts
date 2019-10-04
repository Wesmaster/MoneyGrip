import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeningenComponent } from './leningen.component';

describe('LeningenComponent', () => {
  let component: LeningenComponent;
  let fixture: ComponentFixture<LeningenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeningenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeningenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
