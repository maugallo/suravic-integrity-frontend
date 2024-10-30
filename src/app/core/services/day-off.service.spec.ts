import { TestBed } from '@angular/core/testing';

import { DayOffService } from './day-off.service';

describe('DayOffService', () => {
  let service: DayOffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DayOffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
