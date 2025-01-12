import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EmployeePerYearChartComponent } from './employee-per-year-chart.component';
import { EmployeeService } from 'src/app/sevices/employee.service';


describe('EmployeePerYearChartComponent', () => {
  let component: EmployeePerYearChartComponent;
  let fixture: ComponentFixture<EmployeePerYearChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeePerYearChartComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [ EmployeeService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePerYearChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
