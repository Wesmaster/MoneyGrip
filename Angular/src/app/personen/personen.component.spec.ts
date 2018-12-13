import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchPersoonComponent } from './fetch-persoon.component';

describe('FetchPersoonComponent', () => {
  let component: FetchPersoonComponent;
  let fixture: ComponentFixture<FetchPersoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchPersoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchPersoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
