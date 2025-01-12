import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { EditemployeeComponent } from './editemployee.component';
import { EmployeeService } from 'src/app/sevices/employee.service';
import { UserAuthService } from 'src/app/sevices/user-auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

// Mock services
class MockEmployeeService {
  getemployee(id: number) {
    return of({}); // Return a mock employee object or data
  }

  modfieremployee(id: number, data: any, file: File | null) {
    return of({}); // Return a mock response
  }

  getAllroles() {
    return of([]); // Return a mock list of roles
  }
}

class MockUserAuthService {
  getRoles() {
    return ['Employee']; // Mock roles for testing
  }
}

describe('EditemployeeComponent', () => {
  let component: EditemployeeComponent;
  let fixture: ComponentFixture<EditemployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditemployeeComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: EmployeeService, useClass: MockEmployeeService },
        { provide: UserAuthService, useClass: MockUserAuthService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
