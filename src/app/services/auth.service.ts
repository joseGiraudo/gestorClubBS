import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private user: any = null;

  private logged: boolean = false;

  login(credentials: any) {
    // Lógica de autenticación con el backend
    // Tras el éxito, almacena la información del usuario
    this.user = {
      id: 'user123',
      name: 'Usuario Ejemplo',
      roles: ['user'] // o ['admin'] para administradores
    };
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  logout() {
    this.user = null;
    // Otras tareas de limpieza
    this.logged = false;
  }

  isLoggedIn(): boolean {
    // return !!this.user;
    return this.logged;
  }

  isAdmin(): boolean {
    return this.isLoggedIn() && this.user.roles.includes('admin');
  }

  hasRole(role: string): boolean {
    return this.isLoggedIn() && this.user.roles.includes(role);
  }
}
