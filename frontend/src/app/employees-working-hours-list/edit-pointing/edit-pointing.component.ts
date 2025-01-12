import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthService } from 'src/app/sevices/user-auth.service';
import { Pointage, WorkScheduleServiceService } from 'src/app/sevices/work-schedule-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-pointing',
  templateUrl: './edit-pointing.component.html',
  styleUrls: ['./edit-pointing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditPointingComponent implements OnInit {
  pointageForm: FormGroup;
  disableSaveButton = false;
  disableInputs = false;
  disableBothInputs = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private pointageService: WorkScheduleServiceService,

  ) {
    this.pointageForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      firstname: [{ value: '', disabled: true }],
      lastname: [{ value: '', disabled: true }],
      checkInTime: [''],
      checkOutTime: ['']
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Fetching pointage for id:', id);
    this.pointageService.getPointageById(id).subscribe(
      (data: Pointage) => {
        console.log('Fetched pointage:', data);
        this.pointageForm.patchValue({
          username: data.user.username,
          firstname: data.user.firstname,
          lastname: data.user.lastname,
          checkInTime: data.checkInTime ? this.formatDateTime(new Date(data.checkInTime)) : '',
          checkOutTime: data.checkOutTime ? this.formatDateTime(new Date(data.checkOutTime)) : ''
        });
        this.updateFormState();
      },
      (error: any) => {
        console.error('Error fetching pointage:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error fetching the pointage details.',
        });
      }
    );

  }

  private formatDateTime(dateTime: Date): string {
    if (!(dateTime instanceof Date)) {
      console.error('Invalid date object:', dateTime);
      return '';
    }
    return dateTime.getFullYear() + '-' +
           ('0' + (dateTime.getMonth() + 1)).slice(-2) + '-' +
           ('0' + dateTime.getDate()).slice(-2) + 'T' +
           ('0' + dateTime.getHours()).slice(-2) + ':' +
           ('0' + dateTime.getMinutes()).slice(-2) + ':' +
           ('0' + dateTime.getSeconds()).slice(-2);
  }

  updateFormState() {
    const checkInTime = this.pointageForm.get('checkInTime')?.value;
    const checkOutTime = this.pointageForm.get('checkOutTime')?.value;

    console.log('Updating form state:', { checkInTime, checkOutTime });

    if (checkInTime && checkOutTime) {
      this.disableSaveButton = true;
      this.disableInputs = true;
      this.disableBothInputs = true;
    } else {
      this.disableSaveButton = false;
      this.disableInputs = false;
      this.disableBothInputs = false;

      if (checkInTime && !checkOutTime) {
        this.pointageForm.get('checkInTime')?.disable();
        this.pointageForm.get('checkOutTime')?.enable();
      } else if (!checkInTime && checkOutTime) {
        this.pointageForm.get('checkInTime')?.enable();
        this.pointageForm.get('checkOutTime')?.disable();
      } else {
        this.pointageForm.get('checkInTime')?.enable();
        this.pointageForm.get('checkOutTime')?.enable();
      }
    }
  }

  onCheckInTimeChange() {
    console.log('Check-In Time changed:', this.pointageForm.get('checkInTime')?.value);
    this.pointageForm.get('checkOutTime')?.setValue(''); // Clear checkOutTime
    this.updateFormState();
  }

  onCheckOutTimeChange() {
    console.log('Check-Out Time changed:', this.pointageForm.get('checkOutTime')?.value);
    this.pointageForm.get('checkInTime')?.setValue(''); // Clear checkInTime
    this.updateFormState();
  }

  onSubmit() {
    console.log('Form submission triggered');

    const checkInControl = this.pointageForm.get('checkInTime');
    const checkOutControl = this.pointageForm.get('checkOutTime');

    checkInControl?.enable();
    checkOutControl?.enable();

    const formValues = this.pointageForm.value;
    const id = Number(this.route.snapshot.paramMap.get('id'));

    let checkInTime = formValues.checkInTime ? this.convertToLocalDateTime(new Date(formValues.checkInTime)) : undefined;
    let checkOutTime = formValues.checkOutTime ? this.convertToLocalDateTime(new Date(formValues.checkOutTime)) : undefined;

    // Ensure only one of the times is set
    if (checkInTime && checkOutTime) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Cannot set both check-in and check-out times simultaneously.',
      });
      return;
    }

    // Ensure at least one of the times is set
    if (!checkInTime && !checkOutTime) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Either check-in or check-out time must be set.',
      });
      return;
    }

    this.pointageService.editPointage(id, checkInTime, checkOutTime).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response,
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/home/pointinglist']);
        });
      },
      (error: any) => {
        let errorMessage = 'There was an error updating the pointage.';
        if (error.error) {
          errorMessage = error.error;
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonText: 'OK'
        });
      }
    );
  }

  private convertToLocalDateTime(date: Date): Date {
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - userTimezoneOffset);
  }




}
