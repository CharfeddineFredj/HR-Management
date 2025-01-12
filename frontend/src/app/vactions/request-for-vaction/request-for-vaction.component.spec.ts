import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Import 'of' to create mock observables
import { RequestForVactionComponent } from './request-for-vaction.component';
import { VactionsService } from 'src/app/sevices/vactions.service';


const mockActivatedRoute = {
  queryParams: of({ id: 1 }) // Mock queryParams with a test ID
};

const mockVactionsService = {
  getVacationById: jasmine.createSpy().and.returnValue(of({
    id: 1,
    imageUrl: 'test-image.png',
    // Other necessary properties...
  })) // Mock the method to return a test observable
};

describe('RequestForVactionComponent', () => {
  let component: RequestForVactionComponent;
  let fixture: ComponentFixture<RequestForVactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      declarations: [RequestForVactionComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: VactionsService, useValue: mockVactionsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestForVactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
