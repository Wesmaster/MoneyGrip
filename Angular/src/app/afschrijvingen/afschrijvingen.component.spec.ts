import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfschrijvingenComponent } from './afschrijvingen.component';

describe('AfschrijvingenComponent', () => {
  let component: AfschrijvingenComponent;
  let fixture: ComponentFixture<AfschrijvingenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfschrijvingenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfschrijvingenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
