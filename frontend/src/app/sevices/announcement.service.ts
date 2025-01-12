import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface Announcement {
  id: number | null;
  title: string;
  content: string;
  createdAt?: Date; // Optional because it will be set by the backend
}


@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {


  constructor(private http:HttpClient) { }

  getAllAnnouncements(): Observable<any> {
    return this.http.get(`${environment.baseurl}/announcement/all`);
  }
  addAnnouncements(candidate: any): Observable<any> {
    return this.http.post(`${environment.baseurl}/announcement/save`, candidate);
  }
  removeannounce(id:any){
    return this.http.delete(`${environment.baseurl}/announcement/delet/${id}`)
  }

  updateAnnouncement(announcement: any): Observable<any> {
    return this.http.put(`${environment.baseurl}/announcement/update`, announcement);
  }

  // Method to get an announcement by ID
  getAnnouncementById(id: number): Observable<any> {
    return this.http.get(`${environment.baseurl}/announcement/getone/${id}`);
  }


}
