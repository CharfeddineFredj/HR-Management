import { TestBed } from '@angular/core/testing';
import { WebSocketServicePayslip } from './web-socket-service-payslip.service';

describe('WebSocketServicePayslip', () => {
  let service: WebSocketServicePayslip;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketServicePayslip);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
