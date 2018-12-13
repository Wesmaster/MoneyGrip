import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonOpslaanComponent } from './button-opslaan.component';

describe('ButtonOpslaanComponent', () => {
  let component: ButtonOpslaanComponent;
  let fixture: ComponentFixture<ButtonOpslaanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonOpslaanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonOpslaanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
