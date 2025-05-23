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