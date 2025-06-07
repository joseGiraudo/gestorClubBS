import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../models/login';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  private apiUrl: string = 'http://localhost:8080/auth'

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromToken()
  }

  login(loginRequest: LoginRequest): Observable<{ token: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    console.log(loginRequest)

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap((response) => {
        localStorage.setItem("token", response.token)
        this.currentUserSubject.next(response.user)
      }),
    )
  }


  logout(): void {
    localStorage.removeItem("token")
    this.currentUserSubject.next(null)
    this.router.navigate(["/login"])
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser()
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser()
    return user ? user.role === role : false
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser()
    if (!user) return false
    return roles.includes(user.role)
  }

  private loadUserFromToken(): void {
    const token = this.getToken()
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        if (payload.exp * 1000 > Date.now()) {
          // Token válido, cargar usuario
          this.http.get<User>(`${this.apiUrl}/auth/me`).subscribe({
            next: (user) => this.currentUserSubject.next(user),
            error: () => this.logout(),
          })
        } else {
          this.logout()
        }
      } catch (error) {
        this.logout()
      }
    }
  }
}
