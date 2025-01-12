import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { EditholidayComponent } from './editholiday.component';
import { HolidayService } from 'src/app/sevices/holiday.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('EditholidayComponent', () => {
  let component: EditholidayComponent;
  let fixture: ComponentFixture<EditholidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule
      ],
      declarations: [EditholidayComponent],
      providers: [
        HolidayService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1' // Mock the holiday ID as '1'
              }
            }
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate') // Mock the navigate method
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditholidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
