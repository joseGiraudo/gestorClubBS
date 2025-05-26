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
  isActive: boolean
  status: string
  createdAt: Date
  // teams: Team[]
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