import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonToevoegenComponent } from './button-toevoegen.component';

describe('ButtonToevoegenComponent', () => {
  let component: ButtonToevoegenComponent;
  let fixture: ComponentFixture<ButtonToevoegenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonToevoegenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonToevoegenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
