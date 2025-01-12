import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AddWorkSheduleComponent } from './add-work-shedule.component';
import { WorkScheduleServiceService } from 'src/app/sevices/work-schedule-service.service';


describe('AddWorkSheduleComponent', () => {
  let component: AddWorkSheduleComponent;
  let fixture: ComponentFixture<AddWorkSheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkSheduleComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [ WorkScheduleServiceService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWorkSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
