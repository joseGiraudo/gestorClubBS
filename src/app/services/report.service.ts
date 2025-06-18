import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MemberReportDto, MonthlyCountDto, SportCountDto } from '../models/report';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

    apiUrl: string = 'http://localhost:8080/reports/members'

  constructor(private http: HttpClient) {}

  getMembersSummary(): Observable<MemberReportDto> {
    return this.http.get<MemberReportDto>(`${this.apiUrl}/summary`)
  }

  getAthletesBySport(): Observable<SportCountDto[]> {
    return this.http.get<SportCountDto[]>(`${this.apiUrl}/athletes-by-sport`)
  }

  getNewMembersByMonth(): Observable<MonthlyCountDto[]> {
    return this.http.get<MonthlyCountDto[]>(`${this.apiUrl}/new-members-per-month`)
  }
}
