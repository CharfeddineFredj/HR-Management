import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { AddholidayComponent } from './addholiday.component';
import { HolidayService } from 'src/app/sevices/holiday.service';


describe('AddholidayComponent', () => {
  let component: AddholidayComponent;
  let fixture: ComponentFixture<AddholidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddholidayComponent ],
      imports: [ HttpClientTestingModule, FormsModule ],
      providers: [ HolidayService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddholidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
