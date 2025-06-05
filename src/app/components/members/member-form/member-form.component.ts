import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MembersService } from '../../../services/members.service';
import { pastDateValidation } from '../../../validators/birthdate-validator';
import { emailValidator } from '../../../validators/email-validator';
import { dniValidator } from '../../../validators/dni-validator';

declare var bootstrap: any; // Para usar Bootstrap modal

@Component({
  selector: 'app-member-form',
  imports: [ReactiveFormsModule],
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.css'
})

export class MemberFormComponent implements OnInit {

  memberForm: FormGroup

  private modal: any;
  private toastElement: any;
  private toast: any;

  private memberService = inject(MembersService);

  constructor(private fb: FormBuilder) {
    this.memberForm = this.fb.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['',[ Validators.required]],
      birthdate: [null, [Validators.required, pastDateValidation]],
      type: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    this.memberForm.controls['email'].setAsyncValidators(emailValidator(this.memberService));
    this.memberForm.controls['dni'].setAsyncValidators(dniValidator(this.memberService));

    // Inicializar el toast
    this.toastElement = document.getElementById('responseToast');
    if (this.toastElement) {
      this.toast = new bootstrap.Toast(this.toastElement, {
        autohide: true,
        delay: 4000 // 4 segundos
      });
    }
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      // Mostrar el modal de confirmación
      this.modal.show();
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.memberForm.markAllAsTouched();
      console.log('Formulario inválido', this.memberForm.errors);
    }
  }

  confirmSend(): void {
    if (this.memberForm.valid) {
      // Aquí procesas el envío del formulario
      const formData = this.memberForm.value;
      
      console.log('Datos del formulario:', formData);
      
      // Cerrar el modal
      this.modal.hide();
      
      // Aquí puedes hacer la llamada al servicio para enviar los datos
      this.sendForm(formData);
    }
  }

  // Método para enviar los datos al backend
  private sendForm(data: any): void {

    const newMember = {
        ...this.memberForm.value,
      }
    console.log('Nuevo socio:', newMember)
    
    this.memberService.createMember(newMember).subscribe({
      next: (response) => {
        console.log("Socio creado correctamente: ", response);
        this.showToast('¡Socio creado correctamente!', 'success');
        // Resetear el formulario después del éxito
        this.memberForm.reset();
        // Restablecer el tipo por defecto
        this.memberForm.patchValue({ type: '' });
      },
      error: (error) => {
        console.error("Error al cargar el socio: ", error);
        this.showToast("Error al crear el socio", 'error');
      }
    })
  }

  // Método para mostrar toast
  private showToast(message: string, type: 'success' | 'error'): void {
    const toastBody = document.getElementById('toastBody');
    const toastIcon = document.getElementById('toastIcon');
    const toastContainer = document.getElementById('responseToast');
    
    if (toastBody && toastIcon && toastContainer) {
      // Configurar el mensaje
      toastBody.textContent = message;
      
      // Configurar el estilo según el tipo
      if (type === 'success') {
        toastContainer.className = 'toast align-items-center text-bg-success border-0';
        toastIcon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>
        `;
      } else {
        toastContainer.className = 'toast align-items-center text-bg-danger border-0';
        toastIcon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
        `;
      }
      
      // Mostrar el toast
      this.toast.show();
    }
  }


  // Método para cerrar el modal sin enviar
  cancelSend(): void {
    this.modal.hide();
  }
}
