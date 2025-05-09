import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  apiUrl: string = 'http://localhost:8080/auth'

  constructor(private http: HttpClient  ) { }

  login(loginRequest: LoginRequest): Observable<{ token: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    console.log(loginRequest)

    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, loginRequest, {
      headers,
    });
  }
}
