import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InkomstenComponent } from './inkomsten.component';

describe('InkomstenComponent', () => {
  let component: InkomstenComponent;
  let fixture: ComponentFixture<InkomstenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InkomstenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InkomstenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
