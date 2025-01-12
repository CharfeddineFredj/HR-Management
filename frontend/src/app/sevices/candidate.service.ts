import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



export interface Candidate {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  coverletter : string;
  cv : string;
  date_birth : string ;
  diplomatitle : string ;
  experiences : string ;
  level: string;
  phone: string;
  university : string;
  yearsexperience : number;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CandidateService {


  constructor(private http:HttpClient) { }


  addCandidate(candidate: any): Observable<any> {
    return this.http.post(`${environment.baseurl}/candidate/save`, candidate);
  }

  getAllCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${environment.baseurl}/candidate/all`);
  }

  removeCandidate(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseurl}/candidate/delete/${id}`);
  }

 getCandidate(id: number): Observable<Candidate> {
  return this.http.get<Candidate>(`${environment.baseurl}/candidate/getone/${id}`);
}
 sendConfirmationEmail(candidate: any): Observable<void> {
  return this.http.post<void>(`${environment.baseurl}/candidate/confirm`, candidate);
}

sendRejectionEmail(candidate: any): Observable<void> {
  return this.http.post<void>(`${environment.baseurl}/candidate/reject`, candidate);
}


updateCandidateStatus(id: number, status: string): Observable<{ message: string }> {
  return this.http.put<{ message: string }>(`${environment.baseurl}/candidate/${id}/status?status=${status}`, {});
}



}
