import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { PayrolllistComponent } from './payrolllist.component';
import { PayrollService } from 'src/app/sevices/payroll.service';


describe('PayrolllistComponent', () => {
  let component: PayrolllistComponent;
  let fixture: ComponentFixture<PayrolllistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrolllistComponent ],
      imports: [ HttpClientTestingModule ], // Import HttpClientTestingModule
      providers: [ PayrollService ] // Provide PayrollService if it's needed for the component
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrolllistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
