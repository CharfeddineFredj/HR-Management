import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface VacationRequest {
  id: number;
  registrationNumber: string;
  imageUrl: string;
  status: string;
  period: number;
  start_date: string;
  end_date: string;
  type_vacation: string;
  medicalCertificate?: string;
}



@Injectable({
  providedIn: 'root'
})
export class VactionsService {

  constructor(private http:HttpClient) {}

  getAllVacations(): Observable<any> {
    return this.http.get<any>(`${environment.baseurl}/vactions/all`);
  }

  addvaction(vaction: any): Observable<any> {
    return this.http.post<any>(`${environment.baseurl}/vactions/add`, vaction);
  }

  getEmployeeVacations(registrationNumber: string): Observable<any> {
    return this.http.get(`${environment.baseurl}/vactions/${registrationNumber}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching vacations:', error.message);
        console.error('Error details:', error);
        return throwError(error.message || 'Something went wrong; please try again later.');
      })
    );
  }

  getVacationDays(registrationNumber: string, year: number): Observable<any> {
    return this.http.get(`${environment.baseurl}/vactions/vacation-days?registrationNumber=${registrationNumber}&year=${year}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching vacation days:', error.message);
        console.error('Error details:', error);
        return throwError(error.error || 'Something went wrong; please try again later.');
      })
    );
  }


  getAvailableYears(): Observable<number[]> {
    return this.http.get<number[]>(`${environment.baseurl}/vactions/available-years`).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    console.error('Error fetching data:', error.message);
    return throwError('Something went wrong; please try again later.');
  }

  deleteVacationRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseurl}/vactions/delete/${id}`);
  }
  getVacationById(id: number): Observable<VacationRequest> {
    return this.http.get<VacationRequest>(`${environment.baseurl}/vactions/getone/${id}`);
  }

  approveVacation(id: number): Observable<any> {
    return this.http.put<any>(`${environment.baseurl}/vactions/${id}/approve`, {});
  }

  rejectVacation(id: number): Observable<any> {
    return this.http.put<any>(`${environment.baseurl}/vactions/${id}/reject`, {});
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.baseurl}/users/exists/username/${username}`);
  }


}
