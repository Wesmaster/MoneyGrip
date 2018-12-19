import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMeldingComponent } from './dialog-melding.component';

describe('DialogMeldingComponent', () => {
  let component: DialogMeldingComponent;
  let fixture: ComponentFixture<DialogMeldingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMeldingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMeldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
