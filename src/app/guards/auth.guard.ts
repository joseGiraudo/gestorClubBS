import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { LoginService } from "../services/login.service";

export const authGuard: CanActivateFn = (route, state) => {
    const loginService = inject(LoginService);
    const router = inject(Router);

    if (loginService.isAuthenticated()) {
        return true;
    }

    // Redirige al login si no está autenticado
    return router.parseUrl('/login');
};

export const adminGuard: CanActivateFn = (route, state) => {
    const loginService = inject(LoginService);
    const router = inject(Router);
    
    const expectedRoles = route.data['roles'] as string[] | undefined;
    
    if (expectedRoles && loginService.hasAnyRole(expectedRoles)) {
        return true;
    }
    
    return router.parseUrl('/unauthorized');
};