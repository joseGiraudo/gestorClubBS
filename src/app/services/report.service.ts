import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeeCollectionReport, FullPaymentReportDto, MemberReportDto, MonthlyCountDto, SportCountDto } from '../models/report';
import { Observable } from 'rxjs';
import { Fee } from '../models/payment';
import { APP_CONFIG } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl: string = `${APP_CONFIG.apiUrl}`;
  private membersUrl: string = `${APP_CONFIG.apiUrl}/reports/members`;
  private paymentsUrl: string = `${APP_CONFIG.apiUrl}/reports/payments`;

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
