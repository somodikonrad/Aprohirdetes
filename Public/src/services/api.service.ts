import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private tokenName = environment.tokenName;
  private server = environment.serverUrl;

  getToken(): string | null {
    return localStorage.getItem("auth_token"); // Ne az environment változóból vedd, hanem közvetlenül!
  }
  

  /**
   * Header beállítása a bejelentkezési tokennel
   */
  tokenHeader(): { headers: HttpHeaders } {
    const token = this.getToken();
    if (!token) {
      console.warn('Nincs token a localStorage-ben!');
      return { headers: new HttpHeaders() }; // Üres fejléc, ha nincs token
    }
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }
  

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.server}/categories`, this.tokenHeader());
  }
  

}


