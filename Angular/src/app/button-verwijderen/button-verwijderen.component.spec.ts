import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonVerwijderenComponent } from './button-verwijderen.component';

describe('ButtonVerwijderenComponent', () => {
  let component: ButtonVerwijderenComponent;
  let fixture: ComponentFixture<ButtonVerwijderenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonVerwijderenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonVerwijderenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
