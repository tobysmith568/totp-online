import { TestBed } from '@angular/core/testing';

import { SsrService } from './ssr.service';

describe('SsrService', () => {
  let service: SsrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SsrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
