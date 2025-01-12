import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VactionsService } from './vactions.service';

describe('VactionsService', () => {
  let service: VactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ VactionsService ]
    });
    service = TestBed.inject(VactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
