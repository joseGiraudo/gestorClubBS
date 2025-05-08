import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Fee, Payment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  feesUrl: string = 'http://localhost:8080/fees';
  paymentsUrl: string = 'http://localhost:8080/payments';

  constructor(private http: HttpClient) {}


  // FEES (CUOTAS)

  getFee(id: number): Observable<any> {
    
    console.log("Buscando cuota con id " + id);

    return this.http.get<Fee>(this.feesUrl + `/${id}`);
  }

  payFee(id: number): Observable<Fee> {
    
    console.log("Pagando cuota con id " + id);

    return this.http.get<Fee>(this.feesUrl + `/${id}`);
  }


  // PAYMENTS (PAGOS)

  getPayments(): Observable<Payment[]> {

    return this.http.get<Payment[]>(this.paymentsUrl);
  }


}
