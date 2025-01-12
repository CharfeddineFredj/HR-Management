import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AnnouncementsComponent } from './announcements.component';
import { AnnouncementService } from '../sevices/announcement.service';

describe('AnnouncementsComponent', () => {
  let component: AnnouncementsComponent;
  let fixture: ComponentFixture<AnnouncementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncementsComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers: [
        AnnouncementService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ id: '123' }) // Mock queryParams as needed
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
