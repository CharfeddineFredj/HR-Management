import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortPointage'
})
export class SortPointagePipe implements PipeTransform {

  transform(pointages: any[], sortBy: string, sortOrder: string = 'desc'): any[] {
    if (!pointages || !sortBy) {
      return pointages;
    }

    return pointages.sort((a, b) => {
      let compare = 0;

      // Handle date comparison
      if (sortBy === 'checkInTime' || sortBy === 'checkOutTime') {
        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        if (dateA < dateB) {
          compare = -1;
        } else if (dateA > dateB) {
          compare = 1;
        }
      } else {
        if (a[sortBy] < b[sortBy]) {
          compare = -1;
        } else if (a[sortBy] > b[sortBy]) {
          compare = 1;
        }
      }

      return sortOrder === 'desc' ? compare * -1 : compare;
    });
  }

}
