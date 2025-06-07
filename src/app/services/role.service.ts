import { inject, Injectable } from '@angular/core';
import { LoginService } from './login.service';


export interface RolePermissions {
  canViewAdmin: boolean
  canEditContent: boolean
  canManageUsers: boolean
  canViewReports: boolean
  canDeleteContent: boolean
}


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private loginService = inject(LoginService);

  constructor() { }

  getPermissions(): RolePermissions {
    const user = this.loginService.getCurrentUser()
    if (!user) {
      return this.getDefaultPermissions()
    }

    switch (user.role) {
      case "admin":
        return {
          canViewAdmin: true,
          canEditContent: true,
          canManageUsers: true,
          canViewReports: true,
          canDeleteContent: true,
        }
      case "editor":
        return {
          canViewAdmin: false,
          canEditContent: true,
          canManageUsers: false,
          canViewReports: true,
          canDeleteContent: false,
        }
      case "viewer":
        return {
          canViewAdmin: false,
          canEditContent: false,
          canManageUsers: false,
          canViewReports: false,
          canDeleteContent: false,
        }
      default:
        return this.getDefaultPermissions()
    }
  }

  private getDefaultPermissions(): RolePermissions {
    return {
      canViewAdmin: false,
      canEditContent: false,
      canManageUsers: false,
      canViewReports: false,
      canDeleteContent: false,
    }
  }

  hasPermission(permission: keyof RolePermissions): boolean {
    return this.getPermissions()[permission]
  }
}
