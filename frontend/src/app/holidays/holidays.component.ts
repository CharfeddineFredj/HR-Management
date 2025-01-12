import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Holiday, HolidayService } from '../sevices/holiday.service';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidaysComponent implements OnInit {
  holidays: Holiday[] = [];
  search: string = '';
  page: number = 1;

  constructor(private holidayService: HolidayService) { }

  ngOnInit(): void {
    this.getAllHolidays();
  }

  getAllHolidays(): void {
    this.holidayService.getAllHolidays().subscribe(
      (data: Holiday[]) => {
        this.holidays = data;
      },
      (error) => {
        console.error('Error fetching holidays', error);
      }
    );
  }

  updateSearch(): void {
    // This will be handled by the Angular pipe for filtering
  }

  clearSearch(): void {
    this.search = '';
  }

  downloadCSV(): void {
    // Implement CSV download functionality
  }

  downloadPDF(): void {
    // Implement PDF download functionality
  }
}
