import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EditPointingComponent } from './edit-pointing.component';
import { WorkScheduleServiceService } from 'src/app/sevices/work-schedule-service.service';


describe('EditPointingComponent', () => {
  let component: EditPointingComponent;
  let fixture: ComponentFixture<EditPointingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPointingComponent ],
      imports: [ RouterTestingModule, ReactiveFormsModule, HttpClientTestingModule ],
      providers: [
        FormBuilder,
        WorkScheduleServiceService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }), // Customize the params as needed
            snapshot: { paramMap: { get: () => '123' } } // Mocking snapshot for parameter 'id'
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPointingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
