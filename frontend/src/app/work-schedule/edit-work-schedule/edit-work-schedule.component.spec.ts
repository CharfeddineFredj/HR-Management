import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditWorkScheduleComponent } from './edit-work-schedule.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { WorkScheduleServiceService } from 'src/app/sevices/work-schedule-service.service';


describe('EditWorkScheduleComponent', () => {
  let component: EditWorkScheduleComponent;
  let fixture: ComponentFixture<EditWorkScheduleComponent>;
  let mockWorkScheduleService;

  beforeEach(async () => {
    mockWorkScheduleService = jasmine.createSpyObj(['getWorkScheduleById']);

    await TestBed.configureTestingModule({
      declarations: [ EditWorkScheduleComponent ],
      imports: [ ReactiveFormsModule, HttpClientTestingModule ],
      providers: [
        { provide: WorkScheduleServiceService, useValue: mockWorkScheduleService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue('123') } }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorkScheduleComponent);
    component = fixture.componentInstance;

    mockWorkScheduleService.getWorkScheduleById.and.returnValue(of({
      id: 123,
      user: {
        id: 1,
        username: 'testuser',
        firstname: 'Test',
        lastname: 'User'
      },
      scheduledCheckInTime: '09:00',
      scheduledCheckOutTime: '17:00',
      workDays: [
        { dayOfWeek: 'MONDAY', declared: true },
        { dayOfWeek: 'TUESDAY', declared: false }
      ]
    }));

    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    tick();
    expect(component).toBeTruthy();
  }));

  it('should retrieve the id from route parameters', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    expect(component.editForm.get('id')?.value).toBe(123);
  }));
});
