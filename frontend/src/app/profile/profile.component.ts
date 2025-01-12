import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile, UserService } from '../sevices/user.service';
import { EmployeeService } from '../sevices/employee.service';
import { UserAuthService } from '../sevices/user-auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  userId: number;
  form: FormGroup;
  profile: UserProfile | null = null;
  error: string | null = null;
  activeTab: string = 'overview';
  imageUrl: string | ArrayBuffer = '';
  isAdmin: boolean = false;
  adminForm: FormGroup;
  selectedFile: File | null = null;
  isUsernameDisabled: boolean = true;
  passwordStrength: string = 'weak';
  passwordStrengthText: string = 'Weak';
  tooltipVisible: boolean = false;

  passwordRequirements = {
    minLength: false,
    lowerCase: false,
    upperCase: false,
    number: false,
    specialChar: false
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private employeeService: EmployeeService,
    private authService: UserAuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      renewPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.adminForm = this.fb.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      id_card: ['', Validators.required],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      job: ['', Validators.required],
      salary: ['', Validators.required],
      date_birth: ['', Validators.required],
      hire_date: ['', Validators.required],
      image: ['']
    });

    this.userId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.userService.UserProfileById().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.imageUrl = profile.image ? `http://localhost:8086/administrateur/files/${profile.image}` : 'assets/img/userimg.png';
        this.patchFormValues();
      },
      error: (err) => {
        this.error = 'Failed to load user profile';
        console.error('Failed to load user profile', err);
      }
    });

    this.route.queryParams.subscribe(params => {
      this.activeTab = params['tab'] || 'overview';
    });
    this.isAdmin = this.authService.isAdmin();
    this.loadUserProfile();
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const renewPassword = form.get('renewPassword')?.value;
    return newPassword === renewPassword ? null : { mismatch: true };
  }

  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecialCharacter = /[\W_]+/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialCharacter;

    if (!passwordValid) {
      return { passwordStrength: true };
    }

    return null;
  }

  changePassword(): void {
    if (this.form.valid) {
      this.userService.UserProfileById().subscribe({
        next: (userProfile: UserProfile) => {
          const payload = { userId: userProfile.id, ...this.form.value };

          if (payload.newPassword !== payload.renewPassword) {
            Swal.fire('Error', 'New password and Re-entered password must match.', 'error');
            return;
          }

          this.userService.changePass(payload).subscribe({
            next: (response: any) => {
              if (response?.message) {
                Swal.fire('Success', response.message, 'success');
                this.form.reset();
              }
            },
            error: (error) => {
              let errorMessage = 'New password should not match current one and make sure your current password is correct.';
              if (error?.error?.message) {
                errorMessage = error.error.message;
              }
              Swal.fire('Error', errorMessage, 'error');
            }
          });
        },
        error: () => {
          Swal.fire('Error', 'Failed to get user profile.', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Form is not valid. Please check your inputs.', 'error');
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.router.navigate([], { queryParams: { tab } });
  }

  loadUserProfile(): void {
    this.userService.getoneusers(this.userId).subscribe({
      next: (profile: UserProfile) => {
        this.adminForm.patchValue(profile);
        if (profile.image) {
          this.imageUrl = `http://localhost:8086/employee/files/${profile.image}`;
        } else {
          this.imageUrl = 'assets/img/userimg.png';
        }
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        Swal.fire('Error', 'Failed to load profile.', 'error');
      }
    });
  }

  patchFormValues(): void {
    if (this.profile) {
      console.log('Profile:', this.profile);
      const formattedHireDate = this.convertDateToDatetimeLocalFormat(this.profile.hire_date);

      this.adminForm.patchValue({
        username: this.profile.username,
        firstname: this.profile.firstname,
        lastname: this.profile.lastname,
        email: this.profile.email,
        address: this.profile.address,
        id_card: this.profile.id_card,
        phone: this.profile.phone,
        department: this.profile.department,
        job: this.profile.job,
        salary: this.profile.salary,
        date_birth: this.profile.date_birth,
        hire_date: formattedHireDate,
        contract_type: this.profile.contract_type,
        gender: this.profile.gender
      });
    }
  }

  convertDateToDatetimeLocalFormat(date: Date | string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.error('Invalid date:', date);
      return '';
    }
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    return formattedDate;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    console.log('Selected file:', file);

    if (file) {
      if (this.isValidFile(file)) {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => this.imageUrl = e.target.result;
        reader.readAsDataURL(file);
        this.adminForm.get('image')?.updateValueAndValidity();
      } else {
        console.log('Invalid file type or size:', file);
        Swal.fire("Invalid File", "Please select a valid image file.", "error");
      }
    } else {
      console.log('No file selected');
      Swal.fire("Invalid File", "Please select a valid image file.", "error");
    }
  }

  isValidFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSizeInBytes = 2 * 1024 * 1024;
    const isValid = validTypes.includes(file.type) && file.size <= maxSizeInBytes;
    console.log(`File type valid: ${validTypes.includes(file.type)}, File size valid: ${file.size <= maxSizeInBytes}`);
    return isValid;
  }

  resetImage() {
    if (this.profile && this.profile.image) {
      this.imageUrl = `http://localhost:8086/administrateur/files/${this.profile.image}`;
    } else {
      this.imageUrl = 'assets/img/userimg.png';
    }
    this.selectedFile = null;
    this.adminForm.get('image')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.adminForm.valid) {
      const formData = new FormData();

      Object.keys(this.adminForm.controls).forEach(key => {
        const controlValue = this.adminForm.get(key)?.value;
        console.log(`Appending ${key}: ${controlValue}`);
        formData.append(key, controlValue);
      });

      if (this.selectedFile) {
        console.log(`Appending file: ${this.selectedFile.name}`);
        formData.append('file', this.selectedFile, this.selectedFile.name);
      } else if (this.profile && this.profile.image) {
        console.log('Appending existing image:', this.profile.image);
        formData.append('image', this.profile.image);
      } else {
        Swal.fire("Error", "Image is required. Please select an image file.", "error");
        return;
      }

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      this.userService.updateadmin(this.userId, formData).subscribe({
        next: (response) => {
          console.log('Update response:', response);
          Swal.fire('Success', 'Profile updated successfully.', 'success');
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          Swal.fire('Error', 'Failed to update profile.', 'error');
        }
      });
    } else {
      Object.keys(this.adminForm.controls).forEach(key => {
        const control = this.adminForm.get(key);
        console.log(`${key} valid:`, control?.valid);
        if (control && control.invalid) {
          console.log(`${key} errors:`, control.errors);
        }
      });
      Swal.fire('Error', 'Form is not valid. Please check your inputs.', 'error');
    }
  }

  onPasswordInput() {
    const password = this.form.get('newPassword')?.value;

    this.passwordRequirements.minLength = password.length >= 8;
    this.passwordRequirements.lowerCase = /[a-z]/.test(password);
    this.passwordRequirements.upperCase = /[A-Z]/.test(password);
    this.passwordRequirements.number = /[0-9]/.test(password);
    this.passwordRequirements.specialChar = /[\W_]/.test(password);

    if (this.passwordRequirements.minLength && this.passwordRequirements.lowerCase && this.passwordRequirements.upperCase && this.passwordRequirements.number && this.passwordRequirements.specialChar) {
      this.passwordStrength = 'strong';
      this.passwordStrengthText = 'Strong';
    } else if (password.length >= 8) {
      this.passwordStrength = 'medium';
      this.passwordStrengthText = 'Medium';
    } else {
      this.passwordStrength = 'weak';
      this.passwordStrengthText = 'Weak';
    }
  }

  showTooltip() {
    this.tooltipVisible = true;
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }
}
