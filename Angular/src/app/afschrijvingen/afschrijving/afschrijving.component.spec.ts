import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfschrijvingComponent } from './afschrijving.component';

describe('AfschrijvingComponent', () => {
  let component: AfschrijvingComponent;
  let fixture: ComponentFixture<AfschrijvingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfschrijvingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfschrijvingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
