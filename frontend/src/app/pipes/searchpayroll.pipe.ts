import { Pipe, PipeTransform } from '@angular/core';
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
id: number;
}



@Pipe({
  name: 'searchpayroll'
})
export class SearchpayrollPipe implements PipeTransform {

  transform(payrolls: Payroll[], searchTerm: string): Payroll[] {
    if (!payrolls || !searchTerm) {
      return payrolls;
    }

    // Nettoyage du terme de recherche
    searchTerm = searchTerm.trim().toLowerCase();

    return payrolls.filter(payroll => {
      // Nettoyage des valeurs des champs
      const firstName = payroll.user.firstname.toLowerCase().trim();
      const lastName = payroll.user.lastname.toLowerCase().trim();
      const fullName = `${firstName} ${lastName}`;
      const username = payroll.user.username.toLowerCase().trim();

      return (
        firstName.includes(searchTerm) ||
        lastName.includes(searchTerm) ||
        fullName.includes(searchTerm) ||
        username.includes(searchTerm)
      );
    });
  }

}
