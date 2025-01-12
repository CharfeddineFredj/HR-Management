import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { WorkDayRequest, WorkScheduleRequest, WorkScheduleServiceService } from 'src/app/sevices/work-schedule-service.service';


import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-work-shedule',
  templateUrl: './add-work-shedule.component.html',
  styleUrls: ['./add-work-shedule.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddWorkSheduleComponent implements OnInit {
  workSchedule = {
    username: '',
    scheduledCheckInTime: '',
    scheduledCheckOutTime: '',
    workDays: [] as WorkDayRequest[]
  };

  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDays: Set<WorkDayRequest> = new Set<WorkDayRequest>();

  constructor(
    private workScheduleService: WorkScheduleServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  toggleDay(day: string): void {
    const upperDay = day.toUpperCase(); // Convert to uppercase
    const existingDay = Array.from(this.selectedDays).find(d => d.dayOfWeek === upperDay);
    if (existingDay) {
      this.selectedDays.delete(existingDay);
    } else {
      this.selectedDays.add({ dayOfWeek: upperDay, declared: false });
    }
    this.workSchedule.workDays = Array.from(this.selectedDays);
  }

  toggleDeclared(day: string): void {
    const upperDay = day.toUpperCase(); // Convert to uppercase
    const existingDay = Array.from(this.selectedDays).find(d => d.dayOfWeek === upperDay);
    if (existingDay) {
      existingDay.declared = !existingDay.declared;
    } else {
      this.selectedDays.add({ dayOfWeek: upperDay, declared: true });
    }
    this.workSchedule.workDays = Array.from(this.selectedDays);
  }

  isDayDeclared(day: string): boolean {
    const upperDay = day.toUpperCase();
    const existingDay = Array.from(this.selectedDays).find(d => d.dayOfWeek === upperDay);
    return existingDay ? existingDay.declared : false;
  }

  onSubmit() {
    if (!this.workSchedule.username || !this.workSchedule.scheduledCheckInTime || !this.workSchedule.scheduledCheckOutTime || !this.workSchedule.workDays.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields.'
      });
      return;
    }

    this.workScheduleService.checkUsernameExists(this.workSchedule.username).subscribe(
      exists => {
        if (exists) {
          this.submitWorkScheduleForm();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Invalid registration number',
            text: 'The provided registration number does not exist.'
          });
        }
      },
      error => {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Server error',
          text: 'There was an error checking the registration number. Please try again later.'
        });
      }
    );
  }

  submitWorkScheduleForm(): void {
    const workScheduleRequest: WorkScheduleRequest = {
      username: this.workSchedule.username,
      scheduledCheckInTime: this.workSchedule.scheduledCheckInTime,
      scheduledCheckOutTime: this.workSchedule.scheduledCheckOutTime,
      workDays: this.workSchedule.workDays
    };

    this.workScheduleService.addWorkSchedule(workScheduleRequest).subscribe(response => {
      Swal.fire({
        icon: 'success',
        title: 'Work schedule added',
        text: 'The work schedule has been successfully added.'
      }).then(() => {
        this.router.navigate(['/home/Work-timeTable']);
      });
    }, (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while adding the work schedule.'
      });
    });
  }
}
