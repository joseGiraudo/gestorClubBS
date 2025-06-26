import { AfterViewInit, Component, EventEmitter, Inject, inject, Input, OnChanges, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Member } from '../../../models/member';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MembersService } from '../../../services/members.service';
import { isPlatformBrowser } from '@angular/common';

declare var bootstrap: any;


@Component({
  selector: 'app-edit-member',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-member.component.html',
  styleUrl: './edit-member.component.css'
})
export class EditMemberComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() selectedMember: Member | null = null;
  @Output() memberEdited = new EventEmitter<void>();
  
  memberForm: FormGroup;
  isLoading = false;
  
  // toast  
  private toastElement: any;
  private toast: any;


  memberService = inject(MembersService);

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.memberForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dni: [{value: '', disabled: true}], // Campo deshabilitado
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(8)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      birthdate: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeToast();
      }, 100);
    }
  }

  private initializeToast() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.toastElement = document.getElementById("responseToast");
    if (this.toastElement) {
      this.toast = new bootstrap.Toast(this.toastElement, {
        autohide: true,
        delay: 4000,
      });
    } else {
      console.error("Toast element not found");
    }
  }


  ngOnChanges() {
    if (this.selectedMember) {
      this.populateForm();
    }
  }

  populateForm() {
    if (this.selectedMember) {
      this.memberForm.patchValue({
        name: this.selectedMember.name,
        lastName: this.selectedMember.lastName,
        dni: this.selectedMember.dni,
        email: this.selectedMember.email,
        phone: this.selectedMember.phone,
        address: this.selectedMember.address,
        birthdate: this.formatDateForInput(new Date(this.selectedMember.birthdate)),
        type: this.selectedMember.type,
        status: this.selectedMember.status
      });
    }
  }

  onSave() {
    if (this.memberForm.valid && this.selectedMember) {
      this.isLoading = true;
      
      const updatedMember: Member = {
        ...this.selectedMember,
        name: this.memberForm.value.name,
        lastName: this.memberForm.value.lastName,
        email: this.memberForm.value.email,
        phone: this.memberForm.value.phone,
        address: this.memberForm.value.address,
        birthdate: new Date(this.memberForm.value.birthdate),
        type: this.memberForm.value.type,
        status: this.memberForm.value.status
        // DNI no se incluye porque no se puede editar
      };
      
      this.memberService.updateMember(this.selectedMember.id, updatedMember).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showToast('Socio editado con éxito', 'success')
          this.memberEdited.emit();
          this.closeModal();
        },
        error: (error) => {
          this.isLoading = false;
          this.showToast('Error al actualizar socio', 'error')
          console.error('Error al actualizar socio:', error);
          // Opcional: mostrar toast de error
        }
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.memberForm.markAllAsTouched();
    }
  }

  private closeModal() {
    // Cerrar modal usando Bootstrap
    const modalElement = document.getElementById('editMemberModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // enero es 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  clearMember() {
    this.selectedMember = null;
  }

  // Método para resetear el formulario cuando se cierre el modal
  resetForm() {
    this.memberForm.reset();
    this.isLoading = false;
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

}
