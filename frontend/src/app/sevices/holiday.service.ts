import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


// holiday.ts
export class Holiday {
  id: number;
  description: string;
  date: string;
}


@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  constructor(private http:HttpClient) { }


   getAllHolidays(): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`${environment.baseurl}/holidays/all`);;
  }

  addHoliday(holiday: Omit<Holiday, 'id'>): Observable<Holiday> {
    return this.http.post<Holiday>(`${environment.baseurl}/holidays/add`, holiday);
  }

  getHolidayById(id: number): Observable<Holiday> {
    return this.http.get<Holiday>(`${environment.baseurl}/holidays/getone/${id}`);
  }

  // Update holiday
  updateHoliday(id: number, holiday: Holiday): Observable<Holiday> {
    return this.http.put<Holiday>(`${environment.baseurl}/holidays/update/${id}`, holiday);
  }

}











