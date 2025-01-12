import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchReviewVaction'
})
export class SearchReviewVactionPipe implements PipeTransform {

  transform(items: any[], searchTerm: string): any[] {
    if (!items) return [];
    if (!searchTerm) return items;

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item => {
      return item.registrationNumber.toLowerCase().includes(searchTerm) ||
             item.year.toString().includes(searchTerm);
    });
  }


}
