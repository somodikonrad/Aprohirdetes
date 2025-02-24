import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';  
import { Advertisement } from '../interfaces/Advertisement';

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
    return this.http.get<{ advertisements: any[] }>(`${this.server}/ads`, this.tokenHeader())
      .pipe(
        map(response => {
          return response.advertisements.map(ad => ({
            ...ad,
            user: ad.user || {}  
          }));
        })
      );
  }

  getAdById(id: string): Observable<Advertisement> {
    return this.http.get<Advertisement>(`${this.server}/ads/${id}`, this.tokenHeader());
  }

  getAdsByCategory(category: string): Observable<any[]> {
    return this.http.get<any>(`${this.server}/ads/category/${category}`);
  }

  // Hirdetés mentésére szolgáló metódus
  saveAd(adData: any): Observable<any> {
    const formData = new FormData();
    formData.append('title', adData.title);
    formData.append('price', adData.price);
    formData.append('categoryID', adData.categoryID);
    formData.append('description', adData.description);

  
    console.log(formData);
    return this.http.post(`${this.server}/ads`, formData, this.tokenHeader());
  }
}
