import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

import { MemberReportDto, MonthlyCountDto, SportCountDto } from '../../../models/report';
import { ReportService } from '../../../services/report.service';
import { translateTeamSport } from '../../../models/team';

@Component({
  selector: 'app-member-report',
  standalone: true,
  imports: [BaseChartDirective, CommonModule ],
  templateUrl: './member-report.component.html',
  styleUrl: './member-report.component.css'
})
export class MemberReportComponent implements OnInit {
  
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private reportService = inject(ReportService);

  translateTeamSport = translateTeamSport;

  reportData!: MemberReportDto;
  membersBySport!: SportCountDto[];
  newMembersByMonth!: MonthlyCountDto[];

  objectKeys = Object.keys;

  // Datos para el gráfico de torta (socios por edad)
  pieChartType: 'pie' = 'pie';
  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Socios por rango etario' }
    }
  };

  // Datos para el gráfico de barras (nuevos socios por mes)
  barChartType: 'bar' = 'bar';
  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{ data: [], label: 'Nuevos socios' }]
  };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Nuevos socios por mes' }
    }
  };

  ngOnInit(): void {
    this.reportService.getMembersSummary().subscribe(data => {
      this.reportData = data;

      this.pieChartData = {
        labels: Object.keys(data.byAgeGroup),
        datasets: [{
          data: Object.values(data.byAgeGroup)
        }]
      };
    });

    this.reportService.getAthletesBySport().subscribe(data => {
      this.membersBySport = data;
    });

    this.reportService.getNewMembersByMonth().subscribe(data => {
      this.newMembersByMonth = data;

      this.barChartData = {
        labels: data.map(d => d.month),
        datasets: [{
          data: data.map(d => d.count),
          label: 'Nuevos socios'
        }]
      };
    });

  }

  get totalAthletes(): number {
    return this.membersBySport?.reduce((total, sport) => total + sport.count, 0) || 0;
  }
}
