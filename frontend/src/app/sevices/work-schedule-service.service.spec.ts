import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { WorkScheduleServiceService } from './work-schedule-service.service';

describe('WorkScheduleServiceService', () => {
  let service: WorkScheduleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ WorkScheduleServiceService ]
    });
    service = TestBed.inject(WorkScheduleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
