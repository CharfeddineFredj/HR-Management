import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidateService } from 'src/app/sevices/candidate.service';
import { UserAuthService } from 'src/app/sevices/user-auth.service';
import { UserService } from 'src/app/sevices/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-espace-candidat',
  templateUrl: './espace-candidat.component.html',
  styleUrls: ['./espace-candidat.component.css']
})
export class EspaceCandidatComponent implements OnInit {
  candidateForm: FormGroup;
  selectedCvFile: File = null;
  selectedCoverLetterFile: File = null;
  maxSize = 2 * 1024 * 1024; // 2 MB
  currentYear: number = new Date().getFullYear();
  formSubmitted: boolean = false;
  isLoading: boolean = false; // Add the loading flag

  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    private userService: UserService,
    private candidateService: CandidateService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.candidateForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      lastname: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      date_birth: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      level: ['', Validators.required],
      diplomatitle: ['', Validators.required],
      university: ['', Validators.required],
      yearsexperience: [0, Validators.required],
      experiences: ['', Validators.required],
      subject_ref: ['', Validators.required],
    });
  }

  onCvFileSelected(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size <= this.maxSize) {
        this.selectedCvFile = file;
      } else {
        Swal.fire({
          title: 'File Too Large',
          text: 'Please upload a CV file smaller than 2 MB.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.selectedCvFile = null;
        (event.target as HTMLInputElement).value = ''; // Clear the input
      }
    } else {
      Swal.fire({
        title: 'Invalid File Type',
        text: 'Please upload a PDF file for CV.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.selectedCvFile = null;
      (event.target as HTMLInputElement).value = ''; // Clear the input
    }
  }

  onCoverLetterFileSelected(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size <= this.maxSize) {
        this.selectedCoverLetterFile = file;
      } else {
        Swal.fire({
          title: 'File Too Large',
          text: 'Please upload a cover letter file smaller than 2 MB.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.selectedCoverLetterFile = null;
        (event.target as HTMLInputElement).value = ''; // Clear the input
      }
    } else {
      Swal.fire({
        title: 'Invalid File Type',
        text: 'Please upload a PDF file for cover letter.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.selectedCoverLetterFile = null;
      (event.target as HTMLInputElement).value = ''; // Clear the input
    }
  }
  onSubmit() {
    this.formSubmitted = true;
    this.markFormControlsAsTouched();

    if (this.candidateForm.valid && this.selectedCvFile && this.selectedCoverLetterFile) {
      this.isLoading = true; // Show the loader when submission starts

      const formData: FormData = new FormData();
      formData.append('firstname', this.candidateForm.get('firstname').value);
      formData.append('lastname', this.candidateForm.get('lastname').value);
      formData.append('date_birth', this.candidateForm.get('date_birth').value);
      formData.append('email', this.candidateForm.get('email').value);
      formData.append('phone', this.candidateForm.get('phone').value);
      formData.append('level', this.candidateForm.get('level').value);
      formData.append('diplomatitle', this.candidateForm.get('diplomatitle').value);
      formData.append('university', this.candidateForm.get('university').value);
      formData.append('yearsexperience', this.candidateForm.get('yearsexperience').value);
      formData.append('experiences', this.candidateForm.get('experiences').value);
      formData.append('subject_ref', this.candidateForm.get('subject_ref').value);
      formData.append('cv', this.selectedCvFile, this.selectedCvFile.name);
      formData.append('coverletter', this.selectedCoverLetterFile, this.selectedCoverLetterFile.name);

      this.candidateService.addCandidate(formData).subscribe(() => {
        this.isLoading = false; // Hide the loader after successful submission
        Swal.fire({
          title: 'Success',
          text: 'Candidature added. Check your email for confirmation.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.candidateForm.reset();
          this.selectedCvFile = null;
          this.selectedCoverLetterFile = null;
          this.formSubmitted = false;
          this.router.navigate(['/candidat']);
        });
      }, (error) => {
        this.isLoading = false; // Hide the loader if there's an error
        Swal.fire({
          title: 'Error',
          text: 'There was an error adding the candidate',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
    } else {
      let errorMessage = 'Please fill in all required fields.';

      if (!this.selectedCvFile) {
        errorMessage = 'Please upload a CV.';
      } else if (!this.selectedCoverLetterFile) {
        errorMessage = 'Please upload a cover letter.';
      }

      Swal.fire({
        title: 'Form Incomplete',
        text: errorMessage,
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }

  markFormControlsAsTouched() {
    Object.keys(this.candidateForm.controls).forEach(field => {
      const control = this.candidateForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }



  isActive(url: string): boolean {
    return this.router.url === url;
  }
}
