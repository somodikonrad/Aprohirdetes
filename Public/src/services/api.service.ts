import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';  // Importáljuk a map operátort
import { Advertisement } from '../interfaces/Advertisment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private tokenName = environment.tokenName;
  private server = environment.serverUrl;

  getToken(): string | null {
    return localStorage.getItem(this.tokenName);
  }

  tokenHeader(): { headers: HttpHeaders } {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return { headers };
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.server}/categories`, this.tokenHeader());
  }

  registration(data: object) {
    return this.http.post(`${this.server}/users/register`, data);
  }

  login(data: object) {
    return this.http.post(`${this.server}/users/login`, data);
  }

  getAds(): Observable<any[]> {
    return this.http.get<{ advertisements: any[] }>(`${this.server}/ads`, this.tokenHeader())  // Megadjuk a választípust
      .pipe(
        map(response => {
          return response.advertisements.map(ad => ({
            ...ad,
            user: ad.user || {}  // Felhasználói adatokat alapértelmezetten üres objektumként kezeljük
          }));
        })
      );
  }

  getAdById(id: string): Observable<Advertisement> {
    return this.http.get<Advertisement>(`${this.server}/ads/${id}`, this.tokenHeader());
  }
  
} 
