import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DetailscandidatComponent } from './detailscandidat.component';
import { CandidateService } from 'src/app/sevices/candidate.service';


const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: (key: string) => {
        if (key === 'id') {
          return '1'; // Mock ID value
        }
        return null;
      }
    }
  }
};

describe('DetailscandidatComponent', () => {
  let component: DetailscandidatComponent;
  let fixture: ComponentFixture<DetailscandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailscandidatComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        CandidateService // Add if it's provided in the root or needs to be provided in tests
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailscandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
