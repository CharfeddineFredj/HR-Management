import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PaymentBillDetailsComponent } from './payment-bill-details.component';
import { PayrollService } from 'src/app/sevices/payroll.service';


describe('PaymentBillDetailsComponent', () => {
  let component: PaymentBillDetailsComponent;
  let fixture: ComponentFixture<PaymentBillDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentBillDetailsComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers: [
        PayrollService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }), // Mock route params as needed
            snapshot: { paramMap: { get: () => '123' } } // Mock snapshot for parameter 'id'
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentBillDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
