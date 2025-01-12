import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import the HttpClientTestingModule
import { ReviewOfVacationsComponent } from './review-of-vacations.component';
import { VactionsService } from 'src/app/sevices/vactions.service';


describe('ReviewOfVacationsComponent', () => {
  let component: ReviewOfVacationsComponent;
  let fixture: ComponentFixture<ReviewOfVacationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewOfVacationsComponent ],
      imports: [ HttpClientTestingModule ], // Include HttpClientTestingModule
      providers: [ VactionsService ] // Provide your service here
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewOfVacationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
