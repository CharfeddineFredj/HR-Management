import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/sevices/employee.service';
import { UserAuthService } from 'src/app/sevices/user-auth.service';
import Swal from 'sweetalert2';

export class Role {
  id: number;
  name: string;
}

@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})
export class AddemployeeComponent implements OnInit {
  form: FormGroup;
  selectedFile: File = null;
  isLoading: boolean = false;
  imageUrl: string | ArrayBuffer = 'assets/img/userimg.png';
  roles: Role[] = [];
  submitted: boolean = false;  // Add this property

  constructor(private employeeService: EmployeeService,
              private userAuthService: UserAuthService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: [],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      firstname: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      lastname: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      address: ['', Validators.required],
      department: ['Informatique', Validators.required],
      date_birth: ['', Validators.required],
      job: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      hire_date: ['', Validators.required],
      salary: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1)]],
      id_card: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      role: ['Employee', Validators.required],
      gender: ['', Validators.required],
      contract_type: ['CDI', Validators.required]
    });

    this.form.get('firstname').valueChanges.subscribe(() => this.updateUsername());
    this.form.get('lastname').valueChanges.subscribe(() => this.updateUsername());
    this.form.get('id_card').valueChanges.subscribe(() => this.updateUsername());
    this.loadRoles();
  }

  updateUsername() {
    const firstname = this.form.get('firstname').value;
    const lastname = this.form.get('lastname').value;
    const id_card = this.form.get('id_card').value;

    if (firstname && lastname && id_card) {
        const username = `DIGID${firstname.substr(0, 2).toUpperCase()}${lastname.substr(0, 2).toUpperCase()}${id_card.substr(id_card.length - 3).toUpperCase()}`;
        this.form.get('username').setValue(username);
    }
  }

  isUsernameDisabled: boolean = true;

  resetForm() {
    this.form.reset({
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      job: '',
      department: 'Informatique',
      date_birth: '',
      phone: '',
      salary: '',
      id_card: '',
      hire_date: '',
      address: '',
      gender: '',
      contract_type: 'CDI'
    });
  }

  loadRoles() {
    this.employeeService.getAllroles().subscribe({
      next: (roles) => {
        const currentUserRoles = this.userAuthService.getRoles();
        if (currentUserRoles.includes('Administrateur')) {
          this.roles = roles.filter(role => role.name !== 'Administrateur');
        } else if (currentUserRoles.includes('Responsable')) {
          this.roles = roles.filter(role => role.name === 'Employee' || role.name === 'Recruteur');
        } else {
          this.roles = roles;
        }
      },
      error: (error) => console.error('Failed to load roles:', error)
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    event.target.value = '';
    if (file && this.isValidFile(file)) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imageUrl = e.target.result;
      reader.readAsDataURL(file);
    } else {
      Swal.fire("Invalid File", "Please select a valid image file.", "error");
    }
  }

  isValidFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSizeInBytes = 2 * 1024 * 1024;
    return validTypes.includes(file.type) && file.size <= maxSizeInBytes;
  }

  onSubmit() {
    this.submitted = true;  // Mark the form as submitted

    if (this.form.invalid) {
      Swal.fire('Attention', 'Please fill in all required fields and select a profile image.', 'warning');
      return;
    }

    if (this.form.valid && this.selectedFile) {
      Swal.fire({
        title: 'Confirmation',
        text: 'Do you want to add a new employee?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, add it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.isLoading = true;

          this.employeeService.checkUsernameExists(this.form.value.username).subscribe(usernameExists => {
            if (usernameExists) {
              this.isLoading = false;
              Swal.fire('Error', 'Username already exists! Please choose another one.', 'error');
            } else {
              this.employeeService.checkEmailExists(this.form.value.email).subscribe(emailExists => {
                if (emailExists) {
                  this.isLoading = false;
                  Swal.fire('Error', 'Email already in use! Please use another email.', 'error');
                } else {
                  this.employeeService.signupEmployee(this.form.value, this.selectedFile).subscribe({
                    next: (response: any) => {
                      Swal.fire({
                        title: 'Successful Registration!',
                        text: 'The employee has been registered successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                      });
                      this.router.navigate(['/home/listemployee']);
                    },
                    error: (error: HttpErrorResponse) => {
                      console.error('Error during registration:', error);
                      Swal.fire('Error', 'Registration failed. Please try again.', 'error');
                    },
                    complete: () => {
                      this.isLoading = false;
                    },
                  });
                }
              });
            }
          });
        }
      });
    } else {
      Swal.fire('Attention', 'Please fill in all required fields and select a profile image.', 'warning');
    }
  }



  resetImage() {
    this.imageUrl = 'assets/img/userimg.png';
    this.selectedFile = null;
  }
}
