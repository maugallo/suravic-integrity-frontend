import { TestBed } from '@angular/core/testing';

import { CreditAccountService } from './credit-account.service';

describe('CreditAccountService', () => {
  let service: CreditAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
