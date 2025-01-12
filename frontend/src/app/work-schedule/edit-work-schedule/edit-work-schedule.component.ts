import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkScheduleServiceService, WorkScheduleRequest, WorkDayRequest } from 'src/app/sevices/work-schedule-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-work-schedule',
  templateUrl: './edit-work-schedule.component.html',
  styleUrls: ['./edit-work-schedule.component.css']
})
export class EditWorkScheduleComponent implements OnInit {
  editForm: FormGroup;
  daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  selectedDays: Set<string> = new Set<string>();
  declaredDays: Set<string> = new Set<string>();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private workScheduleService: WorkScheduleServiceService
  ) { }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      id: [''],
      user: this.formBuilder.group({
        id: [''],
        username: [''],
        firstname: [''],
        lastname: ['']
      }),
      scheduledCheckInTime: ['', Validators.required],
      scheduledCheckOutTime: ['', Validators.required],
      workDays: [[], Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.workScheduleService.getWorkScheduleById(+id).subscribe(data => {
        this.editForm.patchValue({
          id: data.id,
          user: {
            id: data.user.id,
            username: data.user.username,
            firstname: data.user.firstname,
            lastname: data.user.lastname
          },
          scheduledCheckInTime: data.scheduledCheckInTime,
          scheduledCheckOutTime: data.scheduledCheckOutTime,
          workDays: data.workDays.map((day: any) => ({
            dayOfWeek: day.dayOfWeek,
            declared: day.declared
          }))
        });
        this.selectedDays = new Set(data.workDays.map((day: any) => day.dayOfWeek));
        this.declaredDays = new Set(data.workDays.filter((day: any) => day.declared).map((day: any) => day.dayOfWeek));
      });
    }
  }

  toggleDay(day: string): void {
    if (this.selectedDays.has(day)) {
      this.selectedDays.delete(day);
    } else {
      this.selectedDays.add(day);
    }
    this.updateWorkDays();
  }

  toggleDeclared(day: string): void {
    if (this.declaredDays.has(day)) {
      this.declaredDays.delete(day);
    } else {
      this.declaredDays.add(day);
    }
    this.updateWorkDays();
  }

  isDayDeclared(day: string): boolean {
    return this.declaredDays.has(day);
  }

  updateWorkDays(): void {
    const workDays: WorkDayRequest[] = Array.from(this.selectedDays).map(day => ({
      dayOfWeek: day,
      declared: this.declaredDays.has(day)
    }));
    this.editForm.get('workDays')?.setValue(workDays);
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields.'
      });
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    const workScheduleRequest: WorkScheduleRequest = {
      username: this.editForm.get('user.username')?.value,
      scheduledCheckInTime: this.editForm.get('scheduledCheckInTime')?.value,
      scheduledCheckOutTime: this.editForm.get('scheduledCheckOutTime')?.value,
      workDays: this.editForm.get('workDays')?.value
    };

    console.log('Updating Work Schedule with payload:', workScheduleRequest);

    this.workScheduleService.updateWorkSchedule(+id, workScheduleRequest).subscribe(
      () => {
        Swal.fire({
          title: 'Success!',
          text: 'Work Schedule updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/home/Work-timeTable']);
        });
      },
      (error) => {
        console.error('Error occurred while updating work schedule:', error);
        Swal.fire({
          title: 'Error!',
          text: `An error occurred while updating the work schedule. ${error.message}`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

}
