import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fee, FeeStatsDto } from '../../../models/payment';
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
  fees: FeeStatsDto[] = [];
  errorMessage = '';

  editMode = false;
  editingFeeId: number | null = null;
  
  private toastElement: any;
  private toast: any;

  // modal de confirmacion
  isModalVisible = false;
  modalLoading = false;

  modalMessage: string = '¿Seguro quieres realizar la acción?';
  modalTitle: string = 'Confirmar';
  modalAction: 'create-fee' | 'send-reminder' | null = null;
  selectedFee: Fee | null = null;

  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

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
    setTimeout(() => {
      this.initializeToast();
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
    this.paymentService.getFeesWithStats().subscribe({
      next: (data) => this.fees = data,
      error: () => this.errorMessage = 'Error al cargar cuotas'
    });
  }


  // Modal de confirmacion

  openCreateFeeModal(): void {
    if (this.feeForm.invalid) return;
    this.selectedFee = { ...this.feeForm.value };
    this.openModal('create-fee');
  }

  openSendEmailsModal(): void {
    this.openModal('send-reminder');
  }

  openModal(action: 'create-fee' | 'send-reminder'): void {
    this.modalAction = action;

    if (action === 'create-fee' && this.feeForm.valid) {
      const { month, year, amount } = this.feeForm.value;
      this.modalTitle = `Confirmar creación de cuota ${month} / ${year} --- $ ${amount}`;
      this.modalMessage = `Se generarán las órdenes de pago de ${this.monthNames[month - 1]} de ${year} para todos los socios activos.`;
    }

    if (action === 'send-reminder') {
      this.modalTitle = 'Confirmar envío de recordatorios de pago';
      this.modalMessage = 'Se enviará un correo electrónico a todos los socios con cuotas pendientes.';
    }

    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.modalAction = null;
    this.selectedFee = null;
  }

  modalConfirm(): void {    
    if (!this.modalAction) {
      this.closeModal();
      return;
    }
    this.modalLoading = true;
    this.errorMessage = '';

    console.log("aaaaaaa", this.modalAction)
    console.log("cuota", this.selectedFee)
    
    if (this.modalAction === 'create-fee' && this.selectedFee) {
      
      this.showToast('Creando cuota y Generando pagos', 'loading');
      
      this.paymentService.createFee(this.selectedFee).subscribe({
        next: () => {
          this.showToast('Cuota y órdenes de pago creadas correctamente', 'success');
          this.feeForm.reset();
          this.loadFees();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al crear la cuota';
          this.showToast(this.errorMessage, 'error');
          this.closeModal();
          this.modalLoading = false;
        },
        complete: () => {
          this.modalLoading = false;
          this.selectedFee = null;
          this.modalAction = null;
          this.closeModal();
        }
      });
    }

    if (this.modalAction === 'send-reminder') {
      this.showToast('Enviando emails', 'loading');
      
      this.paymentService.sendPaymentReminders().subscribe({
        next: () => {
          this.showToast('Emails enviados correctamente', 'success');
        },
        error: () => {
          this.showToast('Error al enviar los emails', 'error');
        },
        complete: () => {
          this.selectedFee = null;
          this.modalAction = null;
          this.modalLoading = false;
          this.closeModal();
        }
      });
    }
  }


    // Método para mostrar toast
  private showToast(message: string, type: 'success' | 'error' | 'loading' | 'info'): void {
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

        case 'info':
          toastContainer.className = 'toast align-items-center text-bg-info border-0';
          toastIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-11.412-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.018-.252 1.232-.598l.088-.416c-.287.176-.656.246-.866.246-.275 0-.375-.176-.312-.469l.738-3.468c.194-.897-.105-1.319-.808-1.319zm-.93 6.412a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg>
          `;
          break;

        default:
          toastContainer.className = 'toast align-items-center text-bg-info border-0';
          toastIcon.innerHTML = '';
          break;
      }
      
      // Mostrar el toast
      //this.toast.show();
      const toast = new bootstrap.Toast(toastContainer);
      toast.show();
    }
  }
}
