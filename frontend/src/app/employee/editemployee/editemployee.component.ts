import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable, map, switchMap, tap } from 'rxjs';
import { EmployeeService } from 'src/app/sevices/employee.service';
import { UserAuthService } from 'src/app/sevices/user-auth.service'; // Assurez-vous d'importer le service

export class Role {
  id: number;
  name: string;
}

@Component({
  selector: 'app-editemployee',
  templateUrl: './editemployee.component.html',
  styleUrls: ['./editemployee.component.css']
})
export class EditemployeeComponent implements OnInit {
  oneemployee: any;
  form: FormGroup;
  id: number;
  imageUrl: string | ArrayBuffer = '';
  selectedFile: File = null;
  isEditMode: boolean = false;
  availableRoles: any[] = [];
  contract_type: string[] = ['CDI', 'CDD', 'CIVP', 'Karama']; // Contract types


  constructor(
    private employeeService: EmployeeService,
    private userAuthService: UserAuthService, // Injectez le service
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id']; // Ensure the ID is a number
    this.form = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['', Validators.required],
      department: ['', Validators.required],
      date_birth: ['', Validators.required],
      job: ['', Validators.required],
      hire_date: ['', Validators.required],
      salary: ['', Validators.required],
      phone: ['', Validators.required],
      image: [''],
      role: [''],
      contract_type: ['', Validators.required]
    });

    this.loadRoles().pipe(
      switchMap(() => this.employeeService.getemployee(this.id))
    ).subscribe(employee => {
      this.updateEmployeeDetails(employee);
    });
  }

  loadRoles(): Observable<any[]> {
    return this.employeeService.getAllroles().pipe(
      map(roles => {
        const currentUserRoles = this.userAuthService.getRoles();
        if (currentUserRoles.includes('Administrateur')) {
          return roles.filter(role => role.name !== 'Administrateur');
        } else if (currentUserRoles.includes('Responsable')) {
          return roles.filter(role => role.name === 'Employee' || role.name === 'Recruteur');
        } else {
          return roles; // Ou une autre logique pour d'autres rôles
        }
      }),
      tap(filteredRoles => this.availableRoles = filteredRoles) // Set the filtered roles
    );
  }

  updateEmployeeDetails(employee: any): void {
    this.oneemployee = employee;
    this.form.patchValue({
      firstname: employee.firstname,
      lastname: employee.lastname,
      address: employee.address,
      department: employee.department,
      date_birth: employee.date_birth,
      job: employee.job,
      hire_date: this.convertDateToDatetimeLocalFormat(employee.hire_date),
      salary: employee.salary,
      phone: employee.phone,
      role: employee.roles.map(role => role.id),
      contract_type: employee.contract_type

    });
    this.imageUrl = employee.image ? `http://localhost:8086/employee/files/${employee.image}` : '';
  }

  convertDateToDatetimeLocalFormat(date: Date | string): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}T${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  modifierEmployee() {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Invalid Form!',
        text: 'Please fill in all required fields.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const formValue = { ...this.form.value };
    const role = this.availableRoles.find(r => r.id === parseInt(formValue.role, 10));
    formValue.role = role ? role.name : '';

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update the employee details?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.modfieremployee(this.id, formValue, this.selectedFile).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: 'Success!',
              text: 'Employee updated successfully!',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.router.navigate(['/home/listemployee']);
          },
          error: (error) => {
            console.error("Error updating employee:", error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update employee.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    event.target.value = ''; // Reset the input element

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
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    return validTypes.includes(file.type) && file.size <= maxSizeInBytes;
  }

  resetImage() {
    this.imageUrl = `http://localhost:8086/employee/files/${this.oneemployee.image}`; // Reset to default image
    this.selectedFile = null; // Reset the file
  }
}
