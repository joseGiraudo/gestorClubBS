import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { Fee } from '../../../models/payment';
import { FeeCollectionReport } from '../../../models/report';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-report',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-report.component.html',
  styleUrl: './payment-report.component.css'
})
export class PaymentReportComponent implements OnInit {

  fees: Fee[] = [];
  selectedFeeId: number | null = null;
  report: FeeCollectionReport | null = null;

  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private reportService = inject(ReportService);

  ngOnInit(): void {
    
    this.reportService.getFullPaymentsReport().subscribe(data => console.log("payment report", data));

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
      this.reportService.getFeeReport(this.selectedFeeId).subscribe(data => this.report = data);
    }
  }

    // Nombres de meses en español
  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
}
