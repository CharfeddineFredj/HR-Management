import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { HolidayService } from 'src/app/sevices/holiday.service';

export interface Holiday {
  id: number;
  description: string;
  date: string;
}

@Component({
  selector: 'app-addholiday',
  templateUrl: './addholiday.component.html',
  styleUrls: ['./addholiday.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddholidayComponent implements OnInit {
  @ViewChild('holidayForm') holidayForm!: NgForm;

  holiday: Omit<Holiday, 'id'> = {
    description: '',
    date: ''
  };

  constructor(private holidayService: HolidayService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.holidayForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    this.holidayService.addHoliday(this.holiday).subscribe(
      (response) => {
        Swal.fire('Success', 'Holiday added successfully', 'success');
        this.router.navigate(['/home/listHolidays']); // Navigate back to home or holidays list
      },
      (error) => {
        Swal.fire('Error', 'Error adding holiday', 'error');
        console.error('Error adding holiday', error);
      }
    );
  }
}
