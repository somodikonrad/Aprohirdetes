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

  getToken():String | null{
    return localStorage.getItem(this.tokenName);
  }

  tokenHeader():{ headers: HttpHeaders }{
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return { headers }
  }
  

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.server}/categories`, this.tokenHeader());
  }
  

  registration(data: object) {
    return this.http.post(`${this.server}/users/register`, data);
  }
  
  login(data:object){
    return this.http.post(`${this.server}/users/login`, data);
  }

}


