import { TestBed } from '@angular/core/testing';

import { MeatPricingService } from './meat-pricing.service';

describe('MeatPricingService', () => {
  let service: MeatPricingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeatPricingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
