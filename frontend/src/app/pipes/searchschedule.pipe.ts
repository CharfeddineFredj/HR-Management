import { Pipe, PipeTransform } from '@angular/core';
import { WorkSchedule } from '../sevices/work-schedule-service.service';

@Pipe({
  name: 'searchschedule'
})
export class SearchschedulePipe implements PipeTransform {

  transform(schedule: WorkSchedule[], search: string): WorkSchedule[] {
    if (!schedule || !search) {
      return schedule;
    }
    return schedule.filter(schedule =>
      schedule.user.username.toLowerCase().includes(search.toLowerCase()) ||
      schedule.user.firstname.toLowerCase().includes(search.toLowerCase()) ||
      schedule.user.lastname.toLowerCase().includes(search.toLowerCase())
    );
  }
}
