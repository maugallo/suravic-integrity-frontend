import { TestBed } from '@angular/core/testing';

import { MeatDetailsService } from './meat-details.service';

describe('MeatDetailsService', () => {
  let service: MeatDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeatDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
