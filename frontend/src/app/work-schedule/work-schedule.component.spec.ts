import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WorkScheduleComponent } from './work-schedule.component';
import { WorkScheduleServiceService } from '../sevices/work-schedule-service.service';

describe('WorkScheduleComponent', () => {
  let component: WorkScheduleComponent;
  let fixture: ComponentFixture<WorkScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ WorkScheduleComponent ],
      providers: [ WorkScheduleServiceService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
