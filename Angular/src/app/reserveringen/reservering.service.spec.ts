import { TestBed } from '@angular/core/testing';

import { ReserveringService } from './reservering.service';

describe('ReserveringService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReserveringService = TestBed.get(ReserveringService);
    expect(service).toBeTruthy();
  });
});
