import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ContractChartComponent } from './contract-chart.component';
import { EmployeeService } from 'src/app/sevices/employee.service';


describe('ContractChartComponent', () => {
  let component: ContractChartComponent;
  let fixture: ComponentFixture<ContractChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractChartComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [ EmployeeService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
