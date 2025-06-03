import { Component, inject, OnInit } from '@angular/core';
import { Payment, translatePaymentMethod, translatePaymentStatus } from '../../../models/payment';
import { PaymentService } from '../../../services/payment.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Member } from '../../../models/member';

@Component({
  selector: 'app-payment-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.css'
})
export class PaymentListComponent implements OnInit {

  paymentsArray: Payment[] = [];

  // Parámetros de paginación
  currentPage = 0
  pageSize = 10
  totalElements = 0
  totalPages = 0

  // Filtros y ordenamiento
  searchTerm = ""
  selectedStatus = ""
  selectedMethod = ""
  sortBy = "id"
  sortDir = "asc"

  // Estados
  loading = false

   // Opciones para filtros
    statusOptions = [
      { value: "APPROVED", label: "Aprobado" },
      { value: "PENDING", label: "Pendiente" },
      { value: "REJECTED", label: "Rechazado" },
      { value: "CANCELLED", label: "Cancelado" },
    ]

  // traductor de enum
  translatePaymentMethod = translatePaymentMethod;
  translatePaymentStatus = translatePaymentStatus;

  private paymentService = inject(PaymentService);

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.paymentService.getPayments().subscribe((response) => {
      console.log("response: ", response);
      this.paymentsArray = response
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
    onSearchChange() {
      this.currentPage = 0 // Resetear a la primera página
      this.loadPayments()
    }
  
    onStatusFilterChange() {
      this.currentPage = 0
      this.loadPayments()
    }
  
    onActiveFilterChange() {
      this.currentPage = 0
      this.loadPayments()
    }
  
    // Limpiar filtros
    clearFilters() {
      this.searchTerm = ""
      this.selectedStatus = ""
      this.currentPage = 0
      this.loadPayments()
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
  
    // Formateo de datos para la vista
    getFullName(member: Member): string {
      return `${member.name} ${member.lastName}`
    }
  
    formatDate(date: Date): string {
      return new Date(date).toLocaleDateString("es-AR")
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


}
