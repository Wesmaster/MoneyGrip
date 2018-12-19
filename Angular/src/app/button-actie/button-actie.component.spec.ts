import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonActieComponent } from './button-actie.component';

describe('ButtonActieComponent', () => {
  let component: ButtonActieComponent;
  let fixture: ComponentFixture<ButtonActieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonActieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonActieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
