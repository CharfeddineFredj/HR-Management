import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserAuthService } from './user-auth.service';

export interface UserProfile {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  job: string;
  address: string;
  phone: string;
  email: string;
  id_card: string;
  salary: string;
  date_birth: string;
  hire_date: string;
  department: string;
  contract_type: String;
  gender: String;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private userAuthService: UserAuthService) { }



  public login(loginRequest: any): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/api/auth/signin`, loginRequest).pipe(
      tap((response: any) => {
        // Vérifiez et stockez les informations de l'utilisateur en cas de réponse réussie
        if (response) {
          if (response.username) {
            this.userAuthService.setUsername(response.username); // Stocker le nom d'utilisateur
          } else {
            console.error('Username not found in response'); // Log d'erreur
          }
          if (response.jwt) {
            this.userAuthService.setToken(response.jwt); // Stocker le token
          } else {
            console.error('JWT not found in response'); // Log d'erreur
          }
          if (response.id) {
            this.userAuthService.setUserId(response.id); // Stocker l'ID utilisateur
          } else {
            console.error('User ID not found in response'); // Log d'erreur
          }
        } else {
          console.error('Response is null or undefined'); // Log d'erreur
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Assurez-vous que le message d'erreur est correctement formaté
        console.error('Login error:', error);

        // Déterminez le message d'erreur approprié basé sur le type d'erreur
        let errorMessage = 'Failed to login: An unexpected error occurred.';
        if (error.error instanceof ErrorEvent) {
          // Erreur côté client (par exemple, problème réseau)
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Erreur côté serveur
          if (error.status === 400) {
            errorMessage = 'Invalid request: Please check your input.';
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized: Invalid email or password.';
          } else if (error.status === 404) {
            errorMessage = 'Not Found: User not found.';
          } else if (error.status === 500) {
            errorMessage = 'Server Error: Please try again later.';
          }
        }

        return throwError(() => new Error(errorMessage)); // Renvoie l'erreur formatée
      })
    );
  }


  UserProfileById(): Observable<UserProfile> {
    const userId = this.userAuthService.getUserId();
    if (userId) {
      return this.httpClient.get<UserProfile>(`${environment.baseurl}/users/getone/${userId}`).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Get user profile error:', error);
          return throwError(() => new Error('Failed to get user profile: ' + error.message));
        })
      );
    } else {
      return throwError(() => new Error('User ID not found in session'));
    }
  }


  getUserProfile(): Observable<UserProfile> {
    const username = localStorage.getItem('username');
    if (username) {
        return this.httpClient.get<UserProfile>(`${environment.baseurl}/users/username/${username}`);
    } else {
        throw new Error('No username found in session');
    }
}


  getoneusers(id: number): Observable<any> {
    return this.httpClient.get(`${environment.baseurl}/users/getone/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Get one user error:', error);
        return throwError(() => new Error('Failed to get user: ' + error.message));
      })
    );
  }

  public signout(): Observable<any> {
    const token = this.userAuthService.getToken();
    if (!token) {
      return throwError(() => new Error('No token found for signout'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.post(`${environment.baseurl}/api/auth/signout`, {}, { headers }).pipe(
      tap(() => {
        this.userAuthService.clear();
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Signout error:', error);
        return throwError(() => new Error('Failed to sign out: ' + error.message));
      })
    );
  }

  public forUser(): Observable<string> {
    return this.httpClient.get(`${environment.baseurl}/api/auth/signin`, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('forUser error:', error);
        return throwError(() => new Error('Failed to get user: ' + error.message));
      })
    );
  }

  public forAdmin(): Observable<string> {
    return this.httpClient.get(`${environment.baseurl}/api/auth/signin`, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('forAdmin error:', error);
        return throwError(() => new Error('Failed to get admin: ' + error.message));
      })
    );
  }

  public roleMatch(allowedRoles: string[]): boolean {
    const userRoles: string[] = this.userAuthService.getRoles();
    if (userRoles) {
      return allowedRoles.some(role => userRoles.includes(role));
    }
    return false;
  }

  changePass(payload: { userId: number; currentPassword: string; newPassword: string }): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/users/changepassword`, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Change password error:', error);
        return throwError(() => new Error('Failed to change password: ' + error.message));
      })
    );
  }

  forgotPass(email: string): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/users/forgetpassword`, { email }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Forgot password error:', error);
        return throwError(() => new Error('Failed to send forgot password request: ' + error.message));
      })
    );
  }

  resetPass(verificationCode: string, newPassword: string): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/users/resetpassword`, { verificationCode, newPassword }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Reset password error:', error);
        return throwError(() => new Error('Failed to reset password: ' + error.message));
      })
    );
  }

  updateadmin(id: number, formData: FormData): Observable<any> {
    return this.httpClient.put(`${environment.baseurl}/administrateur/updateAdmin/${id}`, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Update admin error:', error);
        return throwError(() => new Error('Failed to update admin: ' + error.message));
      })
    );
  }

  resetAdminImage(id: number, formData: FormData): Observable<any> {
    return this.httpClient.put(`${environment.baseurl}/administrateur/resetImage/${id}`, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Reset admin image error:', error);
        return throwError(() => new Error('Failed to reset admin image: ' + error.message));
      })
    );
  }

  getCurrentUserProfile(): Observable<UserProfile> {
    const username = this.userAuthService.getusername();
    return this.httpClient.get<UserProfile>(`${environment.baseurl}/users/username/${username}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Get user profile error:', error);
        return throwError(() => new Error('Failed to get user profile: ' + error.message));
      })
    );
  }
}
