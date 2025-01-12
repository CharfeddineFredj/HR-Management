import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { VactionsService } from 'src/app/sevices/vactions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-vaction',
  templateUrl: './add-vaction.component.html',
  styleUrls: ['./add-vaction.component.css']
})
export class AddVactionComponent implements OnInit {
  vacationForm: FormGroup;
  showMedicalCertificate: boolean = false;
  maxSize = 2 * 1024 * 1024; // 2 MB
  selectedMedicalFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private vacationService: VactionsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentDate = this.getCurrentDateTime();
    this.vacationForm = this.fb.group({
      registrationNumber: ['', Validators.required],
      created_at: [{ value: currentDate, disabled: true }],
      period: ['0', [Validators.required, Validators.min(1)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      type_vacation: ['individual training vacation', Validators.required],
      medicalCertificate: [null]
    }, { validators: this.periodValidator });

    this.vacationForm.get('type_vacation').valueChanges.subscribe(value => {
      this.showMedicalCertificate = value === 'sick vacation';
      const medicalCertificateControl = this.vacationForm.get('medicalCertificate');
      if (this.showMedicalCertificate) {
        medicalCertificateControl.setValidators([Validators.required]);
      } else {
        medicalCertificateControl.clearValidators();
      }
      medicalCertificateControl.updateValueAndValidity();
    });
  }

  getCurrentDateTime(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  periodValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('start_date').value;
    const endDate = control.get('end_date').value;
    const period = control.get('period').value;

    if (startDate && endDate && period) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffInDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) +1 ;

      if (diffInDays !== period) {
        return { periodMismatch: true };
      }
    }
    return null;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > this.maxSize) {
        Swal.fire({
          title: 'File Too Large',
          text: 'Please upload a medical file smaller than 2 MB.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.selectedMedicalFile = null;
        (event.target as HTMLInputElement).value = ''; // Clear the input
      } else if (file.type !== 'application/pdf') {
        Swal.fire({
          title: 'Invalid File Type',
          text: 'Please upload a PDF file for medical.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.selectedMedicalFile = null;
        (event.target as HTMLInputElement).value = ''; // Clear the input
      } else {
        this.selectedMedicalFile = file;
        this.vacationForm.patchValue({ medicalCertificate: file });
        this.vacationForm.get('medicalCertificate').updateValueAndValidity();
      }
    } else {
      this.selectedMedicalFile = null;
      this.vacationForm.patchValue({ medicalCertificate: null });
      this.vacationForm.get('medicalCertificate').updateValueAndValidity();
    }
  }

  markFormControlsAsTouched(): void {
    Object.keys(this.vacationForm.controls).forEach(field => {
      const control = this.vacationForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  onSubmit(): void {
    this.markFormControlsAsTouched();
    if (this.vacationForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid form submission',
        text: 'Please fill in all required fields correctly before submitting the form.'
      });
      return;
    }

    if (this.showMedicalCertificate && !this.selectedMedicalFile) {
      Swal.fire({
        icon: 'error',
        title: 'Medical Certificate Required',
        text: 'Please upload a valid medical certificate.'
      });
      return;
    }

    const formValue = this.vacationForm.getRawValue();
    this.vacationService.checkUsernameExists(formValue.registrationNumber).subscribe(
      exists => {
        if (exists) {
          this.submitVacationForm(formValue);
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

  submitVacationForm(formValue: any): void {
    const formData = new FormData();
    formData.append('registrationNumber', formValue.registrationNumber);
    formData.append('created_at', this.vacationForm.get('created_at').value);
    formData.append('period', formValue.period);
    formData.append('start_date', formValue.start_date);
    formData.append('end_date', formValue.end_date);
    formData.append('type_vacation', formValue.type_vacation);

    if (this.selectedMedicalFile) {
      formData.append('file', this.selectedMedicalFile);
    }

    this.vacationService.addvaction(formData).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Vacation request submitted successfully',
          text: 'Your vacation request has been submitted and is being processed.'
        });
        this.router.navigate(['/home/conge-employee']);
      },
      error => {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'The total spent vacation days cannot exceed 24 for the year.'
        });
      }
    );
  }
}
