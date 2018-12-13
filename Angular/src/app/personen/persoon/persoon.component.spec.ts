import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersoonComponent } from './persoon.component';

describe('PersoonComponent', () => {
  let component: PersoonComponent;
  let fixture: ComponentFixture<PersoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
