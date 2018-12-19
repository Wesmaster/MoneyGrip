import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgettenComponent } from './budgetten.component';

describe('BudgettenComponent', () => {
  let component: BudgettenComponent;
  let fixture: ComponentFixture<BudgettenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgettenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgettenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
