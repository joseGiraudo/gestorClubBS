import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoginRequest, LoginResponse } from '../models/login';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { error } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  private apiUrl: string = 'http://localhost:8080/auth'

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUserFromToken()
  }

  login(loginRequest: LoginRequest): Observable<{ token: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap((response) => {
        this.setToken(response.token)
        this.currentUserSubject.next(response.user)
      }),
    )
  }

  logout(): void {
    this.removeToken()
    this.currentUserSubject.next(null)
    this.router.navigate(["/login"])
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem("token")
    }
    return null
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("token", token)
    }
  }

  private removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("token")
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
    return !!this.getToken() && !!this.getCurrentUser()
  }

  isAuthenticated$(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
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
  
  loadUserFromToken(): Promise<void> {
    return new Promise<void>((resolve) => {
      const token = this.getToken();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      });
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 > Date.now()) {
          this.http.get<User>(`${this.apiUrl}/me`, {headers}).subscribe({
            next: (user) => {
              this.currentUserSubject.next(user);
              resolve();
            },
            error: () => {
              this.logout();
              resolve();
            }
          });
        } else {
          this.logout();
          resolve();
        }
      } catch {
        this.logout();
        resolve();
      }
    } else {
      resolve();
    }
  });
}
}