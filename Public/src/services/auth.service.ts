import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private tokenName = environment.tokenName;

  private isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$: Observable<boolean> = this.isLoggedIn.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenName);
  }

  login(token: string) {
    localStorage.setItem(environment.tokenName, token);
    this.isLoggedIn.next(true);
  }

  logout() {
    localStorage.removeItem(this.tokenName);
    this.isLoggedIn.next(false);
  }

  loggedUser() {
    const token = localStorage.getItem(this.tokenName);
    if (token) {
      try {
        const payload = token.split('.')[1]; // JWT payload részének kinyerése
        const decodedPayload = JSON.parse(atob(payload)); // Base64 dekódolás
        return decodedPayload; // JSON objektumként visszaadjuk
      } catch (error) {
        console.error('Hibás token!', error);
        return null;
      }
    }
    return null;
  }

  getUserId(): number | null {
    const user = this.loggedUser();
    return user?.id || null;
  }

  isLoggedUser(): boolean {
    return this.isLoggedIn.value;
  }

  isAdmin(): boolean {
    const user = this.loggedUser();
    return user?.role === 'admin';
  }
}
