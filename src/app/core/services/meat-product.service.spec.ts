import { TestBed } from '@angular/core/testing';

import { MeatProductService } from './meat-product.service';

describe('MeatProductService', () => {
  let service: MeatProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeatProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
