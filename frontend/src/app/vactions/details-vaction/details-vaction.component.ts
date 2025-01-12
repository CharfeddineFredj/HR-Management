import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserAuthService } from 'src/app/sevices/user-auth.service';
import { VactionsService } from 'src/app/sevices/vactions.service';

@Component({
  selector: 'app-details-vaction',
  templateUrl: './details-vaction.component.html',
  styleUrls: ['./details-vaction.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsVactionComponent implements OnInit {
  vacations: any[] = [];
  vacationData: { [year: number]: { totalDays: number, spentDays: number, remainingDays: number, vacations: any[], currentPage: number, itemsPerPage: number } } = {};
  registrationNumber: string;
  currentYear: number = new Date().getFullYear();
  years: number[] = [];

  constructor(
    private vacationService: VactionsService,
    private userAuthService: UserAuthService
  ) {
    this.registrationNumber = this.userAuthService.getusername();
    console.log('Decrypted registration number:', this.registrationNumber);
  }

  ngOnInit(): void {
    if (this.registrationNumber) {
      this.fetchAvailableYears();
    } else {
      console.error('Registration number (username) is not found in sessionStorage.');
    }
  }

  fetchAvailableYears(): void {
    this.vacationService.getAvailableYears().subscribe(
      data => {
        console.log('Fetched available years:', data);
        this.years = data.sort((a: number, b: number) => b - a); // Sort years in descending order
        this.years.forEach(year => this.fetchAndCalculateData(year));
      },
      error => {
        console.error('Error fetching available years:', error);
        alert('Error fetching available years: ' + error);
      }
    );
  }

  fetchAndCalculateData(year: number): void {
    this.fetchVacationDays(year);
  }

  fetchVacationDays(year: number): void {
    this.vacationService.getVacationDays(this.registrationNumber, year).subscribe(
      data => {
        console.log(`Fetched vacation days for ${year}:`, data);
        if (data) {
          this.vacationData[year] = {
            totalDays: data.spentDays + data.remainingDays,
            spentDays: data.spentDays,
            remainingDays: data.remainingDays,
            vacations: [],
            currentPage: 1,
            itemsPerPage: 3
          };
          console.log(`Fetched data for ${year} - Total days: ${this.vacationData[year].totalDays}, Spent days: ${this.vacationData[year].spentDays}, Remaining days: ${this.vacationData[year].remainingDays}`);
        }
        this.fetchVacations(year); // Fetch vacations after fetching vacation days
      },
      error => {
        console.error(`Error fetching vacation days for ${year}:`, error);
        alert(`Error fetching vacation days for ${year}: ` + error);
      }
    );
  }

  fetchVacations(year: number): void {
    this.vacationService.getEmployeeVacations(this.registrationNumber).subscribe(
      data => {
        console.log(`Fetched vacations for ${year}:`, data);
        const filteredVacations = data.filter(vacation => new Date(vacation.start_date).getFullYear() === year).sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
        this.vacationData[year].vacations = filteredVacations;
        this.calculateVacationDays(year);
      },
      error => {
        console.error(`Error fetching vacations for ${year}:`, error);
        alert(`Error fetching vacations for ${year}: ` + error);
      }
    );
  }

  calculateVacationDays(year: number): void {
    const approvedVacations = this.vacationData[year].vacations.filter(vacation => vacation.status === 'approved');
    const spentDaysForYear = approvedVacations.reduce((sum, vacation) => sum + vacation.period, 0);
    const remainingDaysForYear = this.vacationData[year].totalDays - spentDaysForYear;

    this.vacationData[year].spentDays = spentDaysForYear;
    this.vacationData[year].remainingDays = remainingDaysForYear;

    console.log(`Total days for ${year} after calculation: ${this.vacationData[year].totalDays}`);
    console.log(`Spent days for ${year} after calculation: ${this.vacationData[year].spentDays}`);
    console.log(`Remaining days for ${year} after calculation: ${this.vacationData[year].remainingDays}`);
  }

  hasVacations(): boolean {
    return this.years.some(year => this.vacationData[year]?.vacations.length > 0);
  }

  pageChanged(year: number, event: any): void {
    this.vacationData[year].currentPage = event;
  }
}
