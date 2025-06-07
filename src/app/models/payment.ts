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
    status: PaymentStatus,
    method?: PaymentMethod,
    mercadoPagoId: string | null,
    recordedBy: number | null
    selected?: boolean
}

export interface PaymentDto {
    id: number,
    memberId: number,
    memberName: string,
    memberDni: string,
    feeId: number,
    feeMonth: number,
    feeYear: number,
    feeAmount: number,
    issuedDate: Date,
    paymentDate: Date,
    status: PaymentStatus,
    method?: PaymentMethod,
    mercadoPagoId?: string,
    recordedBy?: number
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'APPROVED',
  OVERDUE = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  MERCADO_PAGO = 'MERCADO_PAGO'
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
    case 'DEBIT_CARD':
        return 'Débito';
    case 'CREDIT_CARD':
        return 'Crédito';
    default:
      return '';
  }
}