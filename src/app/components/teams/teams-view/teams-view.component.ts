import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';
import { User } from '../../../models/user';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-teams-view',
  imports: [RouterLink],
  templateUrl: './teams-view.component.html',
  styleUrl: './teams-view.component.css'
})
export class TeamsViewComponent {

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

}
