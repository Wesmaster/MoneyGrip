import { TestBed } from '@angular/core/testing';

import { SpaardoelService } from './spaardoel.service';

describe('SpaardoelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpaardoelService = TestBed.get(SpaardoelService);
    expect(service).toBeTruthy();
  });
});
