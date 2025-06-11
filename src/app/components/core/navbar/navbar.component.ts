import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { User } from '../../../models/user';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isLoggedIn$: Observable<boolean>;
  user$: Observable<User | null>;

  constructor(private loginService: LoginService) {
    this.isLoggedIn$ = this.loginService.currentUser$.pipe(
      // Mapeamos para saber si hay usuario
      map(user => !!user)
    );
    this.user$ = this.loginService.currentUser$;
  }

  hasAnyRole(roles: string[]): boolean {
    return this.loginService.hasAnyRole(roles);
  }

  logout() {
    this.loginService.logout();
  }
  
  // Método para verificar roles (opcional)
  hasRole(role: string): boolean {
    return this.loginService.hasRole(role);
  }
}
