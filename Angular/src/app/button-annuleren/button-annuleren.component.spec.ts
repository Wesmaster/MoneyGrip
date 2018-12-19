import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonAnnulerenComponent } from './button-annuleren.component';

describe('ButtonAnnulerenComponent', () => {
  let component: ButtonAnnulerenComponent;
  let fixture: ComponentFixture<ButtonAnnulerenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonAnnulerenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonAnnulerenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
