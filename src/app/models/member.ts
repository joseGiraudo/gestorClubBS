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
  isActive: boolean
  createdAt?: Date
  // teams: Team[]
}

export enum MemberType {
  ATHLETE = 'Deportista',
  ACTIVE = 'Activo',
  NON_RESIDENT = 'No residente'
}

export enum MemberStatus {
  APPROVED = 'Aprobado',
  REJECTED = 'Rechazado',
  PENDING = 'Pendiente'
}

export function translateMemberStatus(status: string): string {
  switch (status) {
    case 'APPROVED':
      return 'Aprobado';
    case 'PENDING':
      return 'Pendiente';
    case 'REJECTED':
      return 'Rechazado'
    default:
      return '';
  }
}