import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GenderChartComponent } from './gender-chart.component';
import { EmployeeService } from 'src/app/sevices/employee.service';


describe('GenderChartComponent', () => {
  let component: GenderChartComponent;
  let fixture: ComponentFixture<GenderChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenderChartComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [ EmployeeService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenderChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
