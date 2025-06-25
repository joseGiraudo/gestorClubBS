import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeeCollectionReport, FullPaymentReportDto, MemberReportDto, MonthlyCountDto, SportCountDto } from '../models/report';
import { Observable } from 'rxjs';
import { Fee } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  apiUrl: string = 'http://localhost:8080';
  membersUrl: string = 'http://localhost:8080/reports/members';
  paymentsUrl: string = 'http://localhost:8080/reports/payments';

  constructor(private http: HttpClient) {}

  getMembersSummary(): Observable<MemberReportDto> {
    return this.http.get<MemberReportDto>(`${this.membersUrl}/summary`)
  }

  getAthletesBySport(): Observable<SportCountDto[]> {
    return this.http.get<SportCountDto[]>(`${this.membersUrl}/athletes-by-sport`)
  }

  getNewMembersByMonth(): Observable<MonthlyCountDto[]> {
    return this.http.get<MonthlyCountDto[]>(`${this.membersUrl}/new-members-per-month`)
  }

  getFullPaymentsReport(): Observable<FullPaymentReportDto> {
    return this.http.get<FullPaymentReportDto>(`${this.paymentsUrl}/full-report`)
  }
  
  getFees(): Observable<Fee[]> {
    return this.http.get<Fee[]>(`${this.apiUrl}/fees`)
  }
  
  getFeeReport(feeId: any): Observable<FeeCollectionReport> {
    return this.http.get<FeeCollectionReport>(`${this.paymentsUrl}/fee-report/${feeId}`)
  }
  
}
