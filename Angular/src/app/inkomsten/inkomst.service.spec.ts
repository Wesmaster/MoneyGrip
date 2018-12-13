import { TestBed } from '@angular/core/testing';

import { InkomstService } from './inkomst.service';

describe('InkomstService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InkomstService = TestBed.get(InkomstService);
    expect(service).toBeTruthy();
  });
});
