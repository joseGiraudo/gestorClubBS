import { Component, inject } from '@angular/core';
import { MemberReportDto, MonthlyCountDto, SportCountDto } from '../../../models/report';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-member-report',
  imports: [],
  templateUrl: './member-report.component.html',
  styleUrl: './member-report.component.css'
})
export class MemberReportComponent {

  report?: MemberReportDto;
  objectKeys = Object.keys;

  membersBySport?: SportCountDto;
  newMembersByMonth?: MonthlyCountDto;


  private reportService = inject(ReportService);

  constructor() {}

  ngOnInit() {
    this.reportService.getMembersSummary().subscribe(data => this.report = data);

    this.reportService.getAthletesBySport().subscribe(data => this.membersBySport = data);
    
    this.reportService.getNewMembersByMonth().subscribe(data => this.newMembersByMonth = data);

    console.log(this.membersBySport);
    console.log(this.newMembersByMonth);
    
  }

}
