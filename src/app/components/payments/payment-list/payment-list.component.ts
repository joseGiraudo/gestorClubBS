import { Component, inject, OnInit } from '@angular/core';
import { Payment, PaymentDto, PaymentMethod, PaymentPayDTO, PaymentStatus, translatePaymentMethod, translatePaymentStatus } from '../../../models/payment';
import { PaymentService } from '../../../services/payment.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Member } from '../../../models/member';
import { Router } from '@angular/router';
import { PaymentDetailComponent } from "../payment-detail/payment-detail.component";

declare var bootstrap: any;

@Component({
  selector: 'app-payment-list',
  imports: [CommonModule, FormsModule, PaymentDetailComponent],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.css'
})
export class PaymentListComponent implements OnInit {

  paymentsArray: PaymentDto[] = [];
  selectedPayment: PaymentDto | null = null;

  // Parámetros de paginación
  currentPage = 0
  pageSize = 10
  totalElements = 0
  totalPages = 0

  // Filtros y ordenamiento
  memberSearchTerm = '';
  selectedStatus = '';
  selectedMethod = '';
  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  dateFrom = '';
  dateTo = '';
  sortBy = 'id';
  sortDir = 'desc';

  // Estados
  loading = false;
  filtersExpanded: boolean = false;

   // Opciones para filtros
  statusOptions = Object.values(PaymentStatus);
  methodOptions = Object.values(PaymentMethod);
  monthOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  yearOptions = [2025, 2026, 2027, 2028, 2029, 2030]

  // traductor de enum
  translatePaymentMethod = translatePaymentMethod;
  translatePaymentStatus = translatePaymentStatus;

  private paymentService = inject(PaymentService);
  private router = inject(Router);

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.loading = true;
    this.paymentService.getPayments(
      this.currentPage, 
      this.pageSize, 
      this.sortBy, 
      this.sortDir, 
      this.memberSearchTerm || undefined,
      this.selectedStatus || undefined,
      this.selectedMethod || undefined,
      this.selectedMonth !== null ? this.selectedMonth : undefined,
      this.selectedYear !== null ? this.selectedYear : undefined,
      this.dateFrom || undefined,
      this.dateTo || undefined
    ).subscribe({
      next: (response) => {
        this.paymentsArray = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.loading = false;
      }
    });
  }

  // Metodos para gestionar los pagos
  approvePayment(id: number, method: PaymentMethod) {

    const payDTO: PaymentPayDTO = {
      paymentId: id,
      method: method
    }

    this.paymentService.approvePayment(payDTO).subscribe({
      next: (response) => {
        console.log("Pago aprobado");
        console.log("Response: ", response);
                
      },
      error: (error) => {
        console.error("error: ", error);
      }
    })
  }


  // Navegación de páginas
  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page
      this.loadPayments()
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1)
  }

  previousPage() {
    this.goToPage(this.currentPage - 1)
  }

  // Filtrado
    onFiltersChange() {
      this.currentPage = 0 // Resetear a la primera página
      this.loadPayments()
    }
  
    // Limpiar filtros
    clearFilters() {
    this.memberSearchTerm = '';
    this.selectedStatus = '';
    this.selectedMethod = '';
    this.selectedMonth = null;
    this.selectedYear = null;
    this.dateFrom = '';
    this.dateTo = '';
    this.currentPage = 0;
    this.loadPayments();
    }
  
    // Ordenamiento
    onSort(column: string) {
      if (this.sortBy === column) {
        this.sortDir = this.sortDir === "asc" ? "desc" : "asc"
      } else {
        this.sortBy = column
        this.sortDir = "asc"
      }
      this.currentPage = 0
      this.loadPayments()
    }
  
    // Cambio de tamaño de página
    onPageSizeChange(newSize: number | string) {
      this.pageSize = typeof newSize === "string" ? Number.parseInt(newSize, 10) : newSize
      this.currentPage = 0
      this.loadPayments()
    }
  
    // Utilidades para la vista
    getPageNumbers(): number[] {
      const pages: number[] = []
      const start = Math.max(0, this.currentPage - 2)
      const end = Math.min(this.totalPages - 1, this.currentPage + 2)
  
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  
    min(a: number, b: number): number {
      return Math.min(a, b)
    }

  // Método para alternar la visibilidad de los filtros
  toggleFilters(): void {
    this.filtersExpanded = !this.filtersExpanded;
  }

  // Método para verificar si hay filtros activos
  hasActiveFilters(): boolean {
    return !!(
      this.memberSearchTerm ||
      this.selectedStatus ||
      this.selectedMethod ||
      this.selectedMonth ||
      this.selectedYear ||
      this.dateFrom ||
      this.dateTo
    );
  }
  
    // Formateo de datos para la vista
    getFullName(member: Member): string {
      return `${member.name} ${member.lastName}`
    }
  
    formatDate(date: Date): string {
      if (!date) return '-';
      return new Date(date).toLocaleDateString("es-AR")
    }

    formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED':
        return "badge bg-success"
      case 'REJECTED':
        return "badge bg-danger"
      case 'CANCELLED':
        return "badge bg-warning"
        case 'PENDING':
        return "badge bg-secondary"
      default:
        return "badge bg-secondary"
    }
  }

  

  // METODOS PARA EL MODAL
  openViewModal(payment: PaymentDto) {
    this.selectedPayment = payment;
  }


}
