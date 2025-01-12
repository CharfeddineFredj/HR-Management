import { Injectable, OnDestroy } from '@angular/core';
import { UserAuthService } from './user-auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenExpirationService implements OnDestroy {
  private intervalId: any;
  private authSubscription: Subscription;

  constructor(private userAuthService: UserAuthService, private router: Router) {
    this.authSubscription = this.userAuthService.getLoggedInObservable().subscribe(loggedIn => {
      if (loggedIn) {
        this.startTokenExpiryCheck();
      } else {
        this.stopTokenExpiryCheck();
      }
    });
  }

  startTokenExpiryCheck(): void {
    this.stopTokenExpiryCheck(); // Ensure no duplicate intervals
    this.intervalId = setInterval(() => {
      this.checkTokenExpiry();
    }, 10000); // Check every 10 seconds
  }

  stopTokenExpiryCheck(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  checkTokenExpiry(): void {
    const token = this.userAuthService.getToken();
    if (!token) {
      // Token not found, user is not logged in
      return;
    }

    const tokenPayload = this.parseJwt(token);
    const now = Math.floor(Date.now() / 1000); // Current time in seconds

    if (tokenPayload && tokenPayload.exp && tokenPayload.exp < now) {
      // Token has expired, log out the user
      this.stopTokenExpiryCheck();
      Swal.fire({
        title: 'Session Expired',
        text: 'Your session has expired. Please log in again.',
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false
      }).then(() => {
        this.userAuthService.clear(); // Clear user authentication
        this.router.navigate(['/login']); // Navigate to the login page
      });
    }
  }

  ngOnDestroy(): void {
    this.stopTokenExpiryCheck();
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Helper function to parse JWT token payload
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  }
}
