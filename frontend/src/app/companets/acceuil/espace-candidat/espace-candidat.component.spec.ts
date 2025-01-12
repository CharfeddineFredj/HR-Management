import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { EspaceCandidatComponent } from './espace-candidat.component';
import { UserService } from 'src/app/sevices/user.service';


describe('EspaceCandidatComponent', () => {
  let component: EspaceCandidatComponent;
  let fixture: ComponentFixture<EspaceCandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspaceCandidatComponent ],
      imports: [ HttpClientTestingModule, ReactiveFormsModule ],
      providers: [ UserService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspaceCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
