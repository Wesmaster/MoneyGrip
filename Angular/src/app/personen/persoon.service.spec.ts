import { TestBed } from '@angular/core/testing';

import { PersoonService } from './persoon.service';

describe('PersoonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersoonService = TestBed.get(PersoonService);
    expect(service).toBeTruthy();
  });
});
