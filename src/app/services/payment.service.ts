import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Fee, FeeDto, FeeStatsDto, Payment, PaymentDto, PaymentPayDTO } from '../models/payment';
import { PageResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  feesUrl: string = 'http://localhost:8080/fees';
  paymentsUrl: string = 'http://localhost:8080/payments';
  // paymentsUrl: string = 'https://acff-181-164-143-143.ngrok-free.app/payments';
  // private mpUrl = 'http://localhost:8080/api/v1/mp';
  private mpUrl = 'https://karson-unstentoriously-unmeditatively.ngrok-free.dev/api/v1/mp';

  constructor(private http: HttpClient) {}


  // FEES (CUOTAS)

  createFee(fee: FeeDto): Observable<Fee> {
    return this.http.post<Fee>(this.feesUrl, fee);
  }

  updateFee(id: number, fee: FeeDto): Observable<Fee> {
    return this.http.put<Fee>(this.feesUrl + `/${id}`, fee);
  }

  getFees(): Observable<Fee[]> {    
    return this.http.get<Fee[]>(this.feesUrl);
  }

  getFeesWithStats(): Observable<FeeStatsDto[]> { 
    return this.http.get<FeeStatsDto[]>(this.feesUrl + '/stats');
  }

  getFee(id: number): Observable<any> {
    
    console.log("Buscando cuota con id " + id);

    return this.http.get<Fee>(this.feesUrl + `/${id}`);
  }

  payFee(id: number): Observable<Fee> {
    
    console.log("Pagando cuota con id " + id);

    return this.http.get<Fee>(this.feesUrl + `/${id}`);
  }


  // PAYMENTS (PAGOS)

  getAllPayments(): Observable<Payment[]> {

    return this.http.get<Payment[]>(this.paymentsUrl);
  }

  getPayments(page: number = 0, size: number = 10, sortBy: string = 'id', 
             sortDir: string = 'desc', memberSearch?: string, status?: string, 
             method?: string, month?: number, year?: number, 
             dateFrom?: string, dateTo?: string): Observable<PageResponse<PaymentDto>> {
    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    
    if (memberSearch && memberSearch.trim()) {
      params = params.set('memberSearch', memberSearch.trim());
    }
    
    if (status && status.trim()) {
      params = params.set('status', status);
    }
    
    if (method && method.trim()) {
      params = params.set('method', method);
    }
    
    if (month !== undefined && month !== null) {
      params = params.set('month', month.toString());
    }
    
    if (year !== undefined && year !== null) {
      params = params.set('year', year.toString());
    }
    
    if (dateFrom && dateFrom.trim()) {
      params = params.set('dateFrom', dateFrom);
    }
    
    if (dateTo && dateTo.trim()) {
      params = params.set('dateTo', dateTo);
    }
    
    return this.http.get<PageResponse<PaymentDto>>(this.paymentsUrl + "/filters", { params });
  }


  getPaymentById(id: number): Observable<Payment> {
    
    console.log("buscando orden de pago con id " + id);

    return this.http.get<Payment>(this.paymentsUrl + `/${id}`);
  }

  getPaymentsByMember(dni: string): Observable<Payment[]> {

    return this.http.get<Payment[]>(this.paymentsUrl + `/pending/${dni}`);
  }

  updatePayment(id: number, payment: PaymentDto): Observable<Payment> {

    return this.http.put<Payment>(this.paymentsUrl + id, payment);
  }

  generatePayments(month: number, year: number): Observable<any> {
    return this.http.post(this.paymentsUrl + '/generate-orders', {
      month,
      year
    })
  }

  sendPaymentReminders(): Observable<any> {
    return this.http.post(this.paymentsUrl + '/pendings', {})
  }


  createPreference(paymentIds: number[]) {
    return this.http.post<{ init_point: string }>(`${this.mpUrl}/preference`, paymentIds);
  }

  approvePayment(payDTO: PaymentPayDTO): Observable<void> {
    return this.http.post<void>(this.paymentsUrl + '/pay', payDTO);
  }

}
