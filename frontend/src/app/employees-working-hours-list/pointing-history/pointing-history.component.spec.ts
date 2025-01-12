import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PointingHistoryComponent } from './pointing-history.component';
import { WorkScheduleServiceService } from 'src/app/sevices/work-schedule-service.service';


describe('PointingHistoryComponent', () => {
  let component: PointingHistoryComponent;
  let fixture: ComponentFixture<PointingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointingHistoryComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers: [
        WorkScheduleServiceService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }), // Mock route params as needed
            snapshot: { paramMap: { get: (key: string) => '123' } } // Mock snapshot as needed
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
