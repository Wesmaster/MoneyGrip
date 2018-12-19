import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaardoelenComponent } from './spaardoelen.component';

describe('SpaardoelenComponent', () => {
  let component: SpaardoelenComponent;
  let fixture: ComponentFixture<SpaardoelenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaardoelenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaardoelenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
