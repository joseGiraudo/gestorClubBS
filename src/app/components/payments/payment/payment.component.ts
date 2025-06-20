import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { Fee, Payment, PaymentStatus } from '../../../models/payment';
import { Member } from '../../../models/member';

declare var bootstrap: any;

// Interface para el resumen de pago
export interface PaymentSummary {
  paymentIds: number[];
  totalAmount: number;
  selectedCount: number;
}


@Component({
  selector: 'app-payment',
  imports: [ ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {

  form: FormGroup;
  searched = false;
  loading = false;
  pendingPayments: Payment[] = [];
  member: Member | null = null;
  selectedPayments: Payment[] = [];
  paymentSummary: PaymentSummary = {
    paymentIds: [],
    totalAmount: 0,
    selectedCount: 0
  };

  // toast  
  private toastElement: any;
  private toast: any;

  private paymentService = inject(PaymentService);

  // Nombres de meses en español
  private monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      memberDni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]]
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    // Inicializar el toast después de que la vista esté completamente cargada
    setTimeout(() => {
      this.initializeToast()
    }, 100)
  }

  private initializeToast() {
    this.toastElement = document.getElementById("responseToast")
    if (this.toastElement) {
      this.toast = new bootstrap.Toast(this.toastElement, {
        autohide: true,
        delay: 4000, // 4 segundos
      })
    } else {
      console.error("Toast element not found")
    }
  }

  searchPayments() {
    if (this.form.valid) {
      this.loading = true;
      this.searched = true;

      const dni = this.form.get('memberDni')?.value;
      
      this.paymentService.getPaymentsByMember(dni).subscribe({
        next: (data) => {
          console.log(data);          
          this.pendingPayments = data;
          if(this.pendingPayments.length > 0) {
            this.member = this.pendingPayments[0].member;
          }
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
          this.pendingPayments = [];
          this.member = null;
          this.loading = false;
        }
      });
    }
  }

  onPaymentSelection(payment: Payment, event: any): void {
    payment.selected = event.target.checked;
    this.updateSelectedPayments();
    this.calculatePaymentSummary();
  }

  selectAll(event: any): void {
    const isChecked = event.target.checked;
    this.pendingPayments.forEach(payment => {
      payment.selected = isChecked;
    });
    this.updateSelectedPayments();
    this.calculatePaymentSummary();
  }

  private updateSelectedPayments(): void {
    this.selectedPayments = this.pendingPayments.filter(payment => payment.selected);
  }

  private calculatePaymentSummary(): void {
    this.paymentSummary = {
      paymentIds: this.selectedPayments.map(payment => payment.id),
      totalAmount: this.selectedPayments.reduce((total, payment) => total + payment.fee.amount, 0),
      selectedCount: this.selectedPayments.length
    };
  }

  // Método principal para procesar el pago
  processPayment(): void {
    if (this.selectedPayments.length === 0) {
      alert('Por favor selecciona al menos una cuota para pagar.');
      return;
    }

    // Mostrar resumen en consola (para debugging)
    console.log('Resumen de pago:', this.paymentSummary);
    console.log('IDs de cuotas seleccionadas:', this.paymentSummary.paymentIds);
    console.log('Total a pagar:', this.paymentSummary.totalAmount);
    
    this.showToast('Cargando cuotas', 'loading')

    this.paymentService.createPreference(this.paymentSummary.paymentIds).subscribe({
      next: (res) => {
        window.location.href = res.init_point; // Redirige a Mercado Pago
      },
      error: (err) => {
        console.error('Error al crear preferencia:', err);
      }
    });

  }


  getMonthYearDescription(fee: Fee): string {
    const monthName = this.monthNames[fee.month - 1] || 'Mes inválido';
    return `${monthName} ${fee.year}`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  }

  isOverdue(payment: Payment): boolean {
    return payment.status === PaymentStatus.OVERDUE;
  }

  resetSearch(): void {
    this.form.reset();
    this.searched = false;
    this.pendingPayments = [];
    this.member = null;
    this.selectedPayments = [];
    this.paymentSummary = {
      paymentIds: [],
      totalAmount: 0,
      selectedCount: 0
    };
  }

  get isAllSelected(): boolean {
    return this.pendingPayments.length > 0 && this.pendingPayments.every(payment => payment.selected);
  }

  get isSomeSelected(): boolean {
    return this.pendingPayments.some(payment => payment.selected);
  }

  trackByPaymentId(index: number, payment: Payment): number {
    return payment.id;
  }

  // Método para ordenar pagos por fecha (más antiguos primero)
  get sortedPayments(): Payment[] {
    return [...this.pendingPayments].sort((a, b) => {
      if (a.fee.year !== b.fee.year) {
        return a.fee.year - b.fee.year;
      }
      return a.fee.month - b.fee.month;
    });
  }

  // Método para obtener el resumen actual (útil para debugging o mostrar info)
  getCurrentSummary(): PaymentSummary {
    return { ...this.paymentSummary };
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
