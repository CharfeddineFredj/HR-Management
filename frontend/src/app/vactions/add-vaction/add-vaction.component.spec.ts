import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AddVactionComponent } from './add-vaction.component';
import { VactionsService } from 'src/app/sevices/vactions.service';


describe('AddVactionComponent', () => {
  let component: AddVactionComponent;
  let fixture: ComponentFixture<AddVactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVactionComponent ],
      imports: [ HttpClientTestingModule, ReactiveFormsModule ],
      providers: [ VactionsService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
