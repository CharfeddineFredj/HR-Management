import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PayrollComponent } from './payroll.component';
import { PayrollService } from '../sevices/payroll.service';


describe('PayrollComponent', () => {
  let component: PayrollComponent;
  let fixture: ComponentFixture<PayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollComponent ],
      imports: [ HttpClientTestingModule ],  // Import HttpClientTestingModule
      providers: [ PayrollService ]  // Provide PayrollService if it's needed for the component
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
