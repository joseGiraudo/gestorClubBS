import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private user: any = null;

  login(credentials: any) {
    // Lógica de autenticación con el backend
    // Tras el éxito, almacena la información del usuario
    this.user = {
      id: 'user123',
      name: 'Usuario Ejemplo',
      roles: ['user'] // o ['admin'] para administradores
    };
  }

  logout() {
    this.user = null;
    // Otras tareas de limpieza
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  isAdmin(): boolean {
    return this.isLoggedIn() && this.user.roles.includes('admin');
  }

  hasRole(role: string): boolean {
    return this.isLoggedIn() && this.user.roles.includes(role);
  }
}
