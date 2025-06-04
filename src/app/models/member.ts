export interface Member {
  id: number
  name: string
  lastName: string
  dni: string
  email: string
  phone: string
  address: string
  birthdate: Date
  type: string
  status: string
  createdAt?: Date
  // teams: Team[]
}

export enum MemberType {
  ATHLETE = 'Deportista',
  ACTIVE = 'Activo',
  NON_RESIDENT = 'No residente'
}

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING'
}

export function translateMemberStatus(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'Activo';
    case 'INACTIVE':
      return 'Inactivo';
    case 'PENDING':
      return 'Pendiente';
    case 'REJECTED':
      return 'Rechazado'
    default:
      return '';
  }
}