import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VactionsService } from 'src/app/sevices/vactions.service';

@Component({
  selector: 'app-review-of-vacations',
  templateUrl: './review-of-vacations.component.html',
  styleUrls: ['./review-of-vacations.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewOfVacationsComponent implements OnInit {

  groupedVacations: any[] = [];
  e: number = 1;
  search: string = '';
  sortDirection: string = 'asc';

  constructor(private vacationService: VactionsService) { }

  ngOnInit(): void {
    this.vacationService.getAllVacations().subscribe(
      (data: any[]) => {
        const groupedData = this.groupVacationsByRegistrationNumberAndYear(data);
        this.groupedVacations = this.calculateRemainingDays(groupedData);
        this.sortVacations(); // Sort initially
      },
      (error) => {
        console.error('Error fetching vacation data', error);
      }
    );
  }

  groupVacationsByRegistrationNumberAndYear(data: any[]): any[] {
    const grouped = data.reduce((acc, vacation) => {
      const year = new Date(vacation.created_at).getFullYear();
      const key = `${vacation.registrationNumber}-${year}`;

      if (!acc[key]) {
        acc[key] = {
          registrationNumber: vacation.registrationNumber,
          year,
          days_vaction: 24,  // Always set to 24 days per year
          spent_days_vaction: 0,
          remaining_days_vaction: 0
        };
      }

      if (vacation.status === 'approved') {
        acc[key].spent_days_vaction += vacation.spent_days_vaction;
      }

      return acc;
    }, {});

    return Object.values(grouped);
  }

  calculateRemainingDays(groupedData: any[]): any[] {
    return groupedData.map(vacation => {
      return {
        ...vacation,
        remaining_days_vaction: vacation.days_vaction - vacation.spent_days_vaction
      };
    });
  }

  sortVacations(): void {
    this.groupedVacations.sort((a, b) => {
      if (this.sortDirection === 'asc') {
        return a.year - b.year;
      } else {
        return b.year - a.year;
      }
    });
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortVacations();
  }

  updateSearch(): void {
    // This method is triggered on each input event
    // It can contain logic to filter data or simply trigger Angular's change detection
  }

  clearSearch(): void {
    this.search = '';  // Clears the search input
    this.updateSearch();  // Optionally update list or icons
  }
}
