import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecruitmentComponent } from './recruitment.component';
import { CandidateService } from '../sevices/candidate.service';


describe('RecruitmentComponent', () => {
  let component: RecruitmentComponent;
  let fixture: ComponentFixture<RecruitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruitmentComponent ],
      imports: [ HttpClientTestingModule ], // Import HttpClientTestingModule here
      providers: [ CandidateService ] // Provide CandidateService if used in the component
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
