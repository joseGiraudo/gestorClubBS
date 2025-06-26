import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { Fee, translatePaymentMethod, translatePaymentStatus } from '../../../models/payment';
import { FeeCollectionReport, FullPaymentReportDto } from '../../../models/report';
import { FormsModule } from '@angular/forms';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-payment-report',
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './payment-report.component.html',
  styleUrl: './payment-report.component.css'
})
export class PaymentReportComponent implements OnInit {

  fees: Fee[] = [];
  selectedFeeId: number | null = null;
  feeReport: FeeCollectionReport | null = null;
  fullReport!: FullPaymentReportDto;

  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private reportService = inject(ReportService);

  translatePaymentMethod = translatePaymentMethod;
  translatePaymentStatus = translatePaymentStatus;


  // GRAFICOS

  // Gráfico de líneas - Recaudación mensual
  lineChartType: 'line' = 'line';
  lineChartData: ChartData<'line', number[], string> = {
    labels: [],
    datasets: [
    {
      label: 'Emisión mensual',
      data: [],
      borderColor: '#3e95cd',
      fill: false,
      tension: 0
    },
    {
      label: 'Recaudación mensual',
      data: [],
      borderColor: '#8e5ea2',
      fill: false,
      tension: 0
    }
  ]
  };
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Recaudación mensual'
      },
      legend: {
        display: true,
        position: 'top'
      },
      datalabels: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Monto ($)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Mes/Año'
        }
      }
    }
  };

  // Gráfico de torta - Estados de pagos
  statusChartType: 'pie' = 'pie';
  statusChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  statusChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Estado de los pagos' },
      legend: { position: 'bottom' },
      datalabels: { color: '#000', font: { weight: 'bold' } }
    }
  };

  // Gráfico de torta - Métodos de pago
  methodChartType: 'pie' = 'pie';
  methodChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  methodChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Método de pago' },
      legend: { position: 'bottom' },
      datalabels: { color: '#000', font: { weight: 'bold' } }
    }
  };
    // Porcentaje de cobro
  collectionPercentage = 0;
  totalIssued = 0;
  totalPaid = 0;



  ngOnInit(): void {
    
    this.reportService.getFullPaymentsReport().subscribe(data => {
      this.fullReport = data;
      console.log(this.fullReport);

      this.lineChartData = {
        labels: data.monthlyTotals.map(d => `${d.month}/${d.year}`),
        datasets: [
          {
            label: 'Total emitido',
            data: data.monthlyTotals.map(d => d.totalIssued),
            borderColor: '#3e95cd',
            fill: false,
            tension: 0.3
          },
          {
            label: 'Total recaudado',
            data: data.monthlyTotals.map(d => d.totalPaid),
            borderColor: '#8e5ea2',
            fill: false,
            tension: 0.3
          }
        ]
      };
      
      // Tasa de cobranza
      this.totalIssued = data.collectionRate.totalIssued;
      this.totalPaid = data.collectionRate.totalPaid;
      this.collectionPercentage = data.collectionRate.percentage;
    });

    this.reportService.getFees().subscribe(data => {
      this.fees = data;

      

      // Selecciona por defecto la primera (la más reciente)
      if (this.fees.length > 0) {
        this.selectedFeeId = this.fees[0].id;
        this.fetchReport();
      }
    });
    
  }

  fetchReport() {
    console.log(this.selectedFeeId);
    
    if (this.selectedFeeId) {
      this.reportService.getFeeReport(this.selectedFeeId).subscribe(data => {
        this.feeReport = data;
        console.log(data);

        // cargo los graficos
        this.statusChartData = {
          labels: data.statusSummary.map(s => translatePaymentStatus(s.status)),
          datasets: [{ 
            data: data.statusSummary.map(s => s.count),
            backgroundColor: [
              '#FF6384', // rojo
              '#36A2EB', // azul
              '#FFCE56'  // amarillo
            ]
          }]
        };

        this.methodChartData = {
          labels: data.methodSummary.map(m => translatePaymentMethod(m.method)),
          datasets: [{ 
            data: data.methodSummary.map(m => m.count),
            backgroundColor: [
              '#4BC0C0', // verde agua
              '#9966FF', // morado
              '#FF9F40'  // naranja
            ]
          }]
        };
      });
    }
  }

    // Nombres de meses en español
  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
}
