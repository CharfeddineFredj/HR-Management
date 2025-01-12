import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface Payroll {
  id: number;
  user: {
    username: string;
    firstname: string;
    lastname: string;
    roles: { name: string }[];
    department : string;
    job: string;
    salary : any;
  };
  payrollDate: string;
  totalHoursWorked: number;
  totalSalary: number;
  overtimeMinutes: number;
  undertimeMinutes: number;
  totalHoursWorkedBeforeAdjustment: number;
}

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private yearSubject = new BehaviorSubject<number>(new Date().getFullYear());
  private monthSubject = new BehaviorSubject<number>(new Date().getMonth() + 1);

  year$ = this.yearSubject.asObservable();
  month$ = this.monthSubject.asObservable();

  constructor(private http: HttpClient) {}

  setYear(year: number): void {
    this.yearSubject.next(year);
  }

  setMonth(month: number): void {
    this.monthSubject.next(month);
  }

  calculatePayrollForAll(year: number, month: number): Observable<void> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());

    return this.http.post<void>(`${environment.baseurl}/payroll/calculateAll`, null, { params });
  }

  getPayrollsByMonth(year: number, month: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/payroll/${year}/${month}`);
  }

  getPayrollData(year: number, month: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseurl}/payroll/?year=${year}&month=${month}`);
  }

  getPayrollsByUserAndMonth(username: string, year: number, month: number): Observable<any> {
    return this.http.get(`${environment.baseurl}/payroll/${username}/${year}/${month}`);
  }


  getPayrollById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.baseurl}/payroll/details/${id}`);
  }


  sendPayslip(file: Blob, username: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, 'payslip.pdf');
    formData.append('username', username);

    return this.http.post(`${environment.baseurl}/payroll/sendPayslip`, formData);
  }

  downloadFile(fileName: string): Observable<Blob> {
    const url = `${environment.baseurl}/payroll/downloadFile/${fileName}`;
    return this.http.get(url, { responseType: 'blob' });
  }




}
