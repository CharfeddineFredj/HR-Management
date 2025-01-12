import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rechercheEmployee'
})
export class RechercheEmployeePipe implements PipeTransform {

  transform(value: any[], term: string): any[] {
    if (!term) {
      return value; // Return the original array if no search term is provided
    }
    term = term.toLowerCase(); // Convert search term to lower case to make the search case insensitive

    return value.filter(item =>
      (item.firstname.toLowerCase() + ' ' + item.lastname.toLowerCase()).includes(term) ||
      item.username.toLowerCase().includes(term) 
    );
  }

}
