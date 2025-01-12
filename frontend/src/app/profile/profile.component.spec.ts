import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileComponent } from './profile.component';

import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../sevices/user.service';
import { EmployeeService } from '../sevices/employee.service';
import { UserAuthService } from '../sevices/user-auth.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        UserService,
        EmployeeService,
        UserAuthService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: 1 } },
            queryParams: of({ tab: 'overview' })
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
