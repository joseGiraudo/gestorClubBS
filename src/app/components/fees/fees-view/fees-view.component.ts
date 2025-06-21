import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fee } from '../../../models/payment';
import { PaymentService } from '../../../services/payment.service';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-fees-view',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './fees-view.component.html',
  styleUrl: './fees-view.component.css'
})
export class FeesViewComponent implements OnInit {

  feeForm!: FormGroup;
  fees: Fee[] = [];
  errorMessage = '';

  editMode = false;
  editingFeeId: number | null = null;
  
  private toastElement: any;
  private toast: any;


  constructor(private fb: FormBuilder, private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.feeForm = this.fb.group({
      month: [null, [Validators.required, Validators.min(1), Validators.max(12)]],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(2000)]],
      amount: [null, [Validators.required, Validators.min(0)]]
    });

    this.loadFees();
  }

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

  loadFees(): void {
    this.paymentService.getFees().subscribe({
      next: (data) => this.fees = data,
      error: () => this.errorMessage = 'Error al cargar cuotas'
    });
  }

  createFee(): void {
    if (this.feeForm.invalid) return;

    this.paymentService.createFee(this.feeForm.value).subscribe({
      next: () => {
        this.feeForm.reset();
        this.showToast('Cuota creada correctamente', 'success')
        this.loadFees();
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al crear cuota';
        this.showToast('Error al crear la cuota', 'error')
      }
    });
  }

  editFee(fee: Fee): void {
    this.editingFeeId = fee.id!;
    this.editMode = true;
    this.feeForm.patchValue({
      month: fee.month,
      year: fee.year,
      amount: fee.amount
    });
  }

  emitPayments(fee: Fee): void {
    console.log('Entro aca', fee);
    
    this.showToast('Generando pagos para la cuota' + fee.month + "/" + fee.year, 'loading')
    // Llamá a tu backend para emitir pagos de esta cuota
    this.paymentService.generatePayments(fee.month, fee.year).subscribe({
      next: () => {
        this.showToast('Pagos generados correctamente', 'success')
      },
      error: () => {
        this.showToast('Error al generar los pagos', 'error')
      }
    });
  }

  updateFee(): void {
    if (this.feeForm.invalid || this.editingFeeId === null) return;

    this.paymentService.updateFee(this.editingFeeId, this.feeForm.value).subscribe({
      next: () => {
        this.editingFeeId = null;
        this.editMode = false;
        this.feeForm.reset();
        this.showToast('Cuota editada correctamente', 'success')
        this.loadFees();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al actualizar cuota'
        this.showToast('Error al actualizar la cuota', 'error')
      } 
    });
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
