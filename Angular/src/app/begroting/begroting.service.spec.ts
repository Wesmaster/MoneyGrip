import { TestBed } from '@angular/core/testing';

import { BegrotingService } from './begroting.service';

describe('BegrotingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BegrotingService = TestBed.get(BegrotingService);
    expect(service).toBeTruthy();
  });
});
