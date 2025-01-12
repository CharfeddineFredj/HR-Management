import { Pipe, PipeTransform } from '@angular/core';
import { Pointage } from '../sevices/work-schedule-service.service';

@Pipe({
  name: 'searchPointage'
})
export class SearchPointagePipePipe implements PipeTransform {

  transform(pointages: Pointage[], search: string): Pointage[] {
    if (!pointages || !search) {
      return pointages;
    }
    const searchLower = search.toLowerCase();
    return pointages.filter(pointage => {
      const fullName = pointage.user.firstname.toLowerCase() + ' ' + pointage.user.lastname.toLowerCase();
      const username = pointage.user.username.toLowerCase();
      return fullName.includes(searchLower) || username.includes(searchLower);
    });
  }


}
