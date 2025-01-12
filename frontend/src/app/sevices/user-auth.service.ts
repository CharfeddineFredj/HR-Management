import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
// import { UserService } from 'src/app/sevices/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  login(loginRequest: { username: any; email: any; password: any; }) {
    throw new Error('Method not implemented.');
  }
  private secretKey = 'DIGID2024';
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor() {}

  private encryptData(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
  }

  private decryptData(data: string): any {
    const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  public setUsername(username: string): void {
    const encryptedUsername = this.encryptData(username);
    localStorage.setItem('username', encryptedUsername);
  }
  public getusername(): string {
    const encryptedUsername = localStorage.getItem('username');
    if (encryptedUsername) {
      return this.decryptData(encryptedUsername);
    }
    return '';
  }

  setUserId(id: number): void {
    const encryptedId = this.encryptData(id);
    localStorage.setItem('userId', encryptedId);
  }

  getUserId(): number | null {
    const encryptedId = localStorage.getItem('userId');
    if (encryptedId) {
      return this.decryptData(encryptedId);
    }
    return null;
  }




  public setRoles(roles: string[]): void {
    const encryptedRoles = this.encryptData(roles);
    localStorage.setItem('roles', encryptedRoles);
  }

  public getRoles(): string[] {
    const encryptedRoles = localStorage.getItem('roles');
    if (encryptedRoles) {
      return this.decryptData(encryptedRoles);
    }
    return [];
  }

  public setToken(jwtToken: string): void {
    const encryptedToken = this.encryptData(jwtToken);
    localStorage.setItem('jwtToken', encryptedToken);
    this.loggedIn.next(true);
  }

  public getToken(): string | null {
    const encryptedToken = localStorage.getItem('jwtToken');
    if (encryptedToken) {
      return this.decryptData(encryptedToken);
    }
    return null;
  }

  public clear(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('roles');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('username');
    this.loggedIn.next(false);
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public getLoggedInObservable() {
    return this.loggedIn.asObservable();
  }

  public isAdmin(): boolean {
    const roles = this.getRoles();
    return roles.includes('Administrateur');
  }
}
