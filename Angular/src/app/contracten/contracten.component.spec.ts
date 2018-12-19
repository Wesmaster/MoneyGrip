import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractenComponent } from './contracten.component';

describe('ContractenComponent', () => {
  let component: ContractenComponent;
  let fixture: ComponentFixture<ContractenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
