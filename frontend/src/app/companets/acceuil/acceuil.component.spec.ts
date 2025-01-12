import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { AcceuilComponent } from './acceuil.component';
import { UserService } from 'src/app/sevices/user.service';


describe('AcceuilComponent', () => {
  let component: AcceuilComponent;
  let fixture: ComponentFixture<AcceuilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceuilComponent ],
      imports: [ HttpClientTestingModule ], // Import HttpClientTestingModule
      providers: [ UserService ] // Provide UserService if it's needed for the component
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceuilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
