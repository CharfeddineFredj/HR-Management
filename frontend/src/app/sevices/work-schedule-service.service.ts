import { Time } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
}

export interface Pointage {
  id: number;
  user: User;
  checkInTime: Date;
  checkOutTime: Date;
  latitude: number;
  longitude: number;
  completed: boolean;
  workSchedule: WorkSchedule;
}

export interface WorkSchedule {
date: string|number|Date;
description: any;
  id: number;
  user: User;
  scheduledCheckInTime: string;
  scheduledCheckOutTime: string;
  workDays: string[];
}
export interface WorkScheduleRequest {
  username: string;
  scheduledCheckInTime: string;
  scheduledCheckOutTime: string;
  workDays: WorkDayRequest[];
}
export interface WorkDayRequest {
  dayOfWeek: string;
  declared: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WorkScheduleServiceService {

  constructor(private http:HttpClient) {}


  addWorkSchedule(workSchedule: WorkScheduleRequest): Observable<any> {
    const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${environment.baseurl}/workschedule/add`, workSchedule, { headers });
  }

  getWorkSchedules(): Observable<WorkSchedule[]> {
    return this.http.get<WorkSchedule[]>(`${environment.baseurl}/workschedule/all`);
  }

  getWorkScheduleById(id: number): Observable<WorkSchedule> {
    return this.http.get<WorkSchedule>(`${environment.baseurl}/workschedule/getone/${id}`);
  }

  updateWorkSchedule(id: number, workSchedule: any): Observable<any> {
    return this.http.put<any>(`${environment.baseurl}/workschedule/edit/${id}`, workSchedule).pipe(
      catchError(error => {
        console.error('Error from API:', error); // Log the error from API
        return throwError(error);
      })
    );
  }



  getWorkSchedulesByUsername(username: string): Observable<any> {
    return this.http.get(`${environment.baseurl}/workschedule/${username}`);
  }

  getPointages(): Observable<any> {
    const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${environment.baseurl}/pointing/all`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching pointages:', error); // Log detailed error
        return throwError(error);
      })
    );
  }

  getPointageById(id: number): Observable<Pointage> {
    return this.http.get<Pointage>(`${environment.baseurl}/pointing/getone/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching pointage:', error);
        return throwError(error);
      })
    );
  }

  editPointage(id: number, checkInTime?: Date, checkOutTime?: Date): Observable<any> {
    let params = new HttpParams().set('id', id.toString());
    if (checkInTime) {
      params = params.set('checkInTime', checkInTime.toISOString());
    }
    if (checkOutTime) {
      params = params.set('checkOutTime', checkOutTime.toISOString());
    }

    return this.http.put(`${environment.baseurl}/pointing/edit`, null, { params, responseType: 'text' });
  }


  private formatDateTime(dateTime: Date): string {
    if (!(dateTime instanceof Date)) {
      console.error('Invalid date object:', dateTime);
      return '';
    }
    return dateTime.getFullYear() + '-' +
           ('0' + (dateTime.getMonth() + 1)).slice(-2) + '-' +
           ('0' + dateTime.getDate()).slice(-2) + 'T' +
           ('0' + dateTime.getHours()).slice(-2) + ':' +
           ('0' + dateTime.getMinutes()).slice(-2) + ':' +
           ('0' + dateTime.getSeconds()).slice(-2);
  }

  getPointageHistoryByUserId(userId: number): Observable<Pointage[]> {
    return this.http.get<Pointage[]>(`${environment.baseurl}/pointing/history/${userId}`);
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.baseurl}/users/exists/username/${username}`);
  }
}

