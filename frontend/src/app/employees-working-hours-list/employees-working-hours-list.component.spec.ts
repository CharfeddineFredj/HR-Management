import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EmployeesWorkingHoursListComponent } from './employees-working-hours-list.component';
import { WorkScheduleServiceService } from '../sevices/work-schedule-service.service';

describe('EmployeesWorkingHoursListComponent', () => {
  let component: EmployeesWorkingHoursListComponent;
  let fixture: ComponentFixture<EmployeesWorkingHoursListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeesWorkingHoursListComponent],
      imports: [HttpClientTestingModule],  // Importer HttpClientTestingModule
      providers: [WorkScheduleServiceService]  // Fournir le service requis
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesWorkingHoursListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
