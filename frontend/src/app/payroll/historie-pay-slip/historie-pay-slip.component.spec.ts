import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { HistoriePaySlipComponent } from './historie-pay-slip.component';
import { PayrollService } from 'src/app/sevices/payroll.service';


describe('HistoriePaySlipComponent', () => {
  let component: HistoriePaySlipComponent;
  let fixture: ComponentFixture<HistoriePaySlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule], // Add HttpClientModule here
      declarations: [HistoriePaySlipComponent],
      providers: [PayrollService] // Provide the PayrollService if it's used in the component
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriePaySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
