import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { LoginService } from "../services/login.service";
import { map, take } from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  return loginService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) return true;
      return router.parseUrl('/login');
    })
  );
};

export const rolesGuard: CanActivateFn = (route, state) => {
    const loginService = inject(LoginService);
    const router = inject(Router);
    
    const expectedRoles = route.data['roles'] as string[] | undefined;
    
    if (expectedRoles && loginService.hasAnyRole(expectedRoles)) {
        return true;
    }
    
    return router.parseUrl('/unauthorized');
};