import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private loginService = inject(LoginService);

  // Observable para el estado de autenticación
  isLoggedIn$ = this.loginService.currentUser$.pipe(
    map(user => !!user && !!this.loginService.getToken())
  );

  // Observable para obtener el usuario actual
  currentUser$ = this.loginService.currentUser$;

  logout() {
    this.loginService.logout();
  }

  // Método para verificar roles (opcional)
  hasRole(role: string): boolean {
    return this.loginService.hasRole(role);
  }

  // Método para verificar múltiples roles (opcional)
  hasAnyRole(roles: string[]): boolean {
    return this.loginService.hasAnyRole(roles);
  }

}
