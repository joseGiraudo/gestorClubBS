import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { Fee, Payment, PaymentStatus } from '../../../models/payment';
import { Member } from '../../../models/member';


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

}
