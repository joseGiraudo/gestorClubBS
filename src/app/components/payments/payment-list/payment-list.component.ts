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

  selectedPaymentToPay?: PaymentDto;
  paymentMethodToUse?: PaymentMethod;
  private payModalInstance: any;

  
  private toastElement: any;
  private toast: any;

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

    // Inicializar el toast
    this.toastElement = document.getElementById('responseToast');
    if (this.toastElement) {
      this.toast = new bootstrap.Toast(this.toastElement, {
        autohide: true,
        delay: 4000 // 4 segundos
      });
    }
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


  openPayModal(payment: PaymentDto) {
    this.selectedPaymentToPay = payment;
    this.paymentMethodToUse = payment.method ?? undefined;

    const el = document.getElementById('payModal');
    if (el) {
      this.payModalInstance = new bootstrap.Modal(el);
      this.payModalInstance.show();
    }
  }

  confirmPayment() {
    if (!this.selectedPaymentToPay || !this.paymentMethodToUse) return;
    this.approvePayment(this.selectedPaymentToPay.id, this.paymentMethodToUse);
    this.payModalInstance.hide();
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
        this.showToast("Pago aprobado", 'success')
        this.loadPayments();
      },
      error: (error) => {
        console.error("error: ", error);
        this.showToast("Error al aprobar el pago", 'error')
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
    console.log(payment);    
    this.selectedPayment = payment;
  }


    // Método para mostrar toast
  private showToast(message: string, type: 'success' | 'error' | 'loading'): void {
    const toastBody = document.getElementById('toastBody');
    const toastIcon = document.getElementById('toastIcon');
    const toastContainer = document.getElementById('responseToast');
    
    if (toastBody && toastIcon && toastContainer) {
      // Configurar el mensaje
      toastBody.textContent = message;
      
      // Configurar el estilo según el tipo
      switch (type) {
        case 'success':
          toastContainer.className = 'toast align-items-center text-bg-success border-0';
          toastIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          `;
          break;

        case 'error':
          toastContainer.className = 'toast align-items-center text-bg-danger border-0';
          toastIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
          `;
          break;

        case 'loading':
          toastContainer.className = 'toast align-items-center text-bg-secondary border-0';
          toastIcon.innerHTML = `
            <div class="spinner-border spinner-border-sm text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          `;
          break;

        default:
          toastContainer.className = 'toast align-items-center text-bg-info border-0';
          toastIcon.innerHTML = '';
          break;
      }
      
      // Mostrar el toast
      this.toast.show();
    }
  }

}
