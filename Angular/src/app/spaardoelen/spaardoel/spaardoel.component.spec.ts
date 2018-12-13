import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaardoelComponent } from './spaardoel.component';

describe('SpaardoelComponent', () => {
  let component: SpaardoelComponent;
  let fixture: ComponentFixture<SpaardoelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaardoelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaardoelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
