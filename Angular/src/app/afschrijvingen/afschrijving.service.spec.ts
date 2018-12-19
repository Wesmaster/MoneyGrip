import { TestBed } from '@angular/core/testing';

import { AfschrijvingService } from './afschrijving.service';

describe('AfschrijvingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AfschrijvingService = TestBed.get(AfschrijvingService);
    expect(service).toBeTruthy();
  });
});
