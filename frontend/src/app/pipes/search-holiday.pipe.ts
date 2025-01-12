import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchHoliday'
})
export class SearchHolidayPipe implements PipeTransform {
  transform(holidays: any[], search: string): any[] {
    if (!holidays || !search) {
      return holidays;
    }
    return holidays.filter(holiday =>
      holiday.description.toLowerCase().includes(search.toLowerCase())
    );
  }
}
