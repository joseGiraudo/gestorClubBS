import { Member } from "./member";

export interface Fee {
    id: number,
    month: number,
    year: number,
    amount: number
}

export interface Payment {
    id: number,
    member: Member,
    fee: Fee,
    paymentDate: Date,
    status: string,
    method: string,
    mercadoPagoId: string | null,
    recordedBy: number | null
}

export function translatePaymentStatus(status: string): string {
  switch (status) {
    case 'APPROVED':
      return 'Aprobado';
    case 'PENDING':
      return 'Pendiente';
    case 'REJECTED':
      return 'Rechazado'
    case 'CANCELLED':
        return 'Cancelado';
    default:
      return '';
  }
}

export function translatePaymentMethod(status: string): string {
  switch (status) {
    case 'MERCADO_PAGO':
      return 'Mercado Pago';
    case 'TRANSFER':
      return 'Transferencia';
    case 'CASH':
        return 'Efectivo';
    case 'CARD':
        return 'Tarjeta';
    default:
      return '';
  }
}