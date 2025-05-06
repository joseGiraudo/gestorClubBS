import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  apiUrl: string = 'http://localhost:8080/members'

  constructor(private http: HttpClient) {}

  getFee(id: number): Observable<any> {
    
    console.log("Buscando cuota con id " + id);

    return of('Buscando cuota con id ' + id);
  }

  payFee(id: number): Observable<any> {
    
    console.log("Pagando cuota con id " + id);

    return of('');
  }
}
