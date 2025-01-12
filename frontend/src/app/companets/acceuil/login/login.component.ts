import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/sevices/user-auth.service';
import { UserService } from 'src/app/sevices/user.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  formSubmitted: boolean = false;
  showForgotPasswordForm = false;
  showResetPasswordForm = false;
  email: string = '';
  resetPasswordForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  failedAttempts: number = 0;
  resetPasswordSuccessful: boolean = false;
  currentYear: number = new Date().getFullYear();

  // New properties for password strength
  passwordStrength = 'weak';
  passwordStrengthText = 'Weak';
  tooltipVisible = false;
  passwordStrongEnough = false;
  passwordRequirements = {
    minLength: false,
    lowerCase: false,
    upperCase: false,
    number: false,
    specialChar: false
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private userAuthService: UserAuthService,
    private formBuilder: FormBuilder,
    private passwordResetService: UserService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.initForm();
    // Check if the user is already logged in
    if (this.userAuthService.isLoggedIn()) {
      // Redirect the user to the home page or another page
      this.router.navigate(['/']);
    }
  }

  initForm() {
    this.resetPasswordForm = this.formBuilder.group({
      verificationCode: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isActive(url: string): boolean {
    return this.router.url === url;
  }

  login() {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    const loginRequest = {
      username: this.form.value.usernameOrEmail.includes('@') ? null : this.form.value.usernameOrEmail,
      email: this.form.value.usernameOrEmail.includes('@') ? this.form.value.usernameOrEmail : null,
      password: this.form.value.password
    };

    this.userService.login(loginRequest).subscribe(
      (response: any) => {
        const roles = response.roles;
        const jwtToken = response.accessToken;

        if (roles && jwtToken) {
          this.userAuthService.setRoles(roles);
          this.userAuthService.setToken(jwtToken);

          const isAdmin = roles.includes('Administrateur');
          const isManager = roles.includes('Responsable');
          const employee = roles.includes('Employee');
          const recruteur = roles.includes('Recruteur');

          Swal.fire({
            title: 'Welcome',
            text: 'Login Successful',
            icon: 'success',
            timer: 2750,  // Auto close after 2.75 seconds
            showConfirmButton: false
          });

          if (isAdmin || isManager || employee || recruteur) {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/acceuil/login']);
          }
        } else {
          console.error('Invalid response format:', response);
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Login failed:', error);

        // Extract the error message from the server response
        const errorMessage = error.error?.message || 'Invalid email or password';

        // Check if the error message indicates the account is not confirmed
        if (errorMessage.includes('Account not confirmed')) {
          Swal.fire({
            title: 'Login Failed',
            text: 'Account not confirmed',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        } else if (errorMessage.includes('User status is inactive')) {
          Swal.fire({
            title: 'Login Failed',
            text: 'User status is inactive',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Login Failed',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }

        this.failedAttempts++;
        this.isLoading = false;
      }
    );
  }



  forgotPass() {
    this.showForgotPasswordForm = true;
  }

  forgotPassword() {
    if (!this.email) {
      Swal.fire('Error', 'Please enter your email.', 'error');
      return;
    }

    this.isLoading = true;

    this.userService.forgotPass(this.email).subscribe({
      next: (response: any) => {
        if (response.user === 'user not found') {
          Swal.fire('Error', 'User not found. Please check your email and try again.', 'error');
        } else {
          Swal.fire('Success', 'Please check your email to reset your password.', 'success').then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              this.showForgotPasswordForm = false;
              this.showResetPasswordForm = true;
            }
          });
        }
      },
      error: (error) => {
        console.error('Error occurred:', error);
        Swal.fire('Error', 'Failed to send reset link. Please try again later.', 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  resetPassword() {
    this.formSubmitted = true;

    if (this.resetPasswordForm.valid && this.passwordStrongEnough) {
      const verificationCode = this.resetPasswordForm.get('verificationCode').value;
      const newPassword = this.resetPasswordForm.get('newPassword').value;

      this.passwordResetService.resetPass(verificationCode, newPassword).subscribe({
        next: (response) => {
          Swal.fire('Success!', 'Your password has been successfully reset. Please login with your new password.', 'success').then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              this.resetPasswordForm.reset();
              this.showResetPasswordForm = false;
              this.showForgotPasswordForm = false;
              this.resetPasswordSuccessful = true;
            }
          });
        },
        error: (error) => {
          console.error(error); // Affiche l'objet d'erreur complet dans la console
          let errorMessage = 'Failed to reset password. Please try again later.';
          // Adaptez cette condition en fonction de la structure réelle de l'objet d'erreur
          if (error.status === 400 && error.error && error.error.message && error.error.message.includes('Invalid verification code')) {
            errorMessage = 'The verification code you entered is incorrect. Please try again.';
          } else if (error.status === 400 && error.message && error.message.includes('Invalid verification code')) {
            errorMessage = 'The verification code you entered is incorrect. Please try again.';
          }

          Swal.fire('Error!', errorMessage, 'error');
        }
      });
    } else {
      Swal.fire('Attention!', 'Please check the form for errors.', 'info');
    }
  }

  onPasswordInput() {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    this.passwordRequirements.minLength = password.length >= 8;
    this.passwordRequirements.lowerCase = /[a-z]/.test(password);
    this.passwordRequirements.upperCase = /[A-Z]/.test(password);
    this.passwordRequirements.number = /[0-9]/.test(password);
    this.passwordRequirements.specialChar = /[\W_]/.test(password);

    this.updatePasswordStrength();
  }

  updatePasswordStrength() {
    const { minLength, lowerCase, upperCase, number, specialChar } = this.passwordRequirements;
    if (minLength && lowerCase && upperCase && number && specialChar) {
      this.passwordStrength = 'strong';
      this.passwordStrengthText = 'Strong';
      this.passwordStrongEnough = true;
    } else if (minLength && (lowerCase || upperCase || number || specialChar)) {
      this.passwordStrength = 'medium';
      this.passwordStrengthText = 'Medium';
      this.passwordStrongEnough = false;
    } else {
      this.passwordStrength = 'weak';
      this.passwordStrengthText = 'Weak';
      this.passwordStrongEnough = false;
    }
  }

  showTooltip() {
    this.tooltipVisible = true;
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }
}
