

export interface User {
    id: number,
    name: string,
    lastName: string,
    email: string,
    password: string | null,
    role: string,
    isActive: boolean
}

export interface CreateUser {
    name: string,
    lastName: string,
    email: string,
    password?: string,
    role: string
}

export enum UserRole {
    ADMIN = 'ADMIN',
    TREASURER = 'TREASURER',
    COMMITTEE = 'COMMITTEE'
}

export function translateUserRole(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'Administrador';
    case 'TREASURER':
      return 'Tesorero';
    case 'COMMITTEE':
      return 'Comisionado';
    default:
      return '';
  }
}