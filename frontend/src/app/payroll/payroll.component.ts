import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PayrollService } from '../sevices/payroll.service';
export class User {
  username: string;
  firstname: string;
  lastname: string;
}

export class Payroll {
  user: User;
  totalHoursWorkedBeforeAdjustment: number;
  totalSalary: number;
  overtimeMinutes: number;
  undertimeMinutes: number;
}


@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PayrollComponent implements OnInit {
  search: string = '';
  page: number = 1;
  year: number;
  month: number;
  payrolls: any[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private payrollService: PayrollService) {}

  ngOnInit(): void {
    // Charger les valeurs de l'année et du mois depuis localStorage
    this.year = +localStorage.getItem('selectedYear') || new Date().getFullYear();
    this.month = +localStorage.getItem('selectedMonth') || new Date().getMonth() + 1;

    // Obtenez les données de la base de données
    this.getPayrolls();
  }

  calculatePayroll(): void {
    this.loading = true;
    this.payrollService.calculatePayrollForAll(this.year, this.month).subscribe({
      next: () => {
        // Mettre à jour les valeurs dans localStorage
        localStorage.setItem('selectedYear', this.year.toString());
        localStorage.setItem('selectedMonth', this.month.toString());

        // Récupérez les données après calcul
        this.getPayrolls();
      },
      error: (err) => {
        console.error('Error calculating payroll:', err);
        this.error = 'Failed to calculate payroll.';
        this.loading = false;
      }
    });
  }

  getPayrolls(): void {
    this.payrollService.getPayrollsByMonth(this.year, this.month).subscribe({
      next: (data) => {
        this.payrolls = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching payrolls:', err);
        this.error = 'Failed to fetch payrolls.';
        this.loading = false;
      }
    });
  }
  updateSearch(): void {
    // Logique pour mettre à jour la recherche si nécessaire
  }

  clearSearch(): void {
    this.search = '';
  }
  get noResultsFound(): boolean {
    // Nettoyage du terme de recherche
    const searchTerm = this.search.trim().toLowerCase();

    if (searchTerm.length === 0) {
      return false; // Aucun terme de recherche entré
    }

    // Filtrage des salaires basés sur le terme de recherche
    const filteredPayrolls = this.payrolls.filter(payroll => {
      // Nettoyage des valeurs pour les comparer
      const firstName = payroll.user.firstname.toLowerCase().trim();
      const lastName = payroll.user.lastname.toLowerCase().trim();
      const fullName = `${firstName} ${lastName}`;
      const username = payroll.user.username.toLowerCase().trim();

      // Comparaison des valeurs après nettoyage
      return (
        firstName.includes(searchTerm) ||
        lastName.includes(searchTerm) ||
        fullName.includes(searchTerm) ||
        username.includes(searchTerm)
      );
    });

    // Vérification si aucun résultat ne correspond à la recherche
    return this.payrolls.length > 0 && filteredPayrolls.length === 0;
  }




  get noDataAvailable(): boolean {
    return this.payrolls.length === 0;
  }
}
