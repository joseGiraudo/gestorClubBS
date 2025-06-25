import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { CreateUser, translateUserRole, User, UserRole } from '../../../models/user';

declare var bootstrap: any;

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {

  @Input() selectedUser: User | null = null; // null para crear, objeto para editar
  @Output() userSaved = new EventEmitter<void>();

  userForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  
  private modalInstance: any;

  private userService = inject(UserService);

  roles = Object.values(UserRole);
  translateUserRole = translateUserRole; 

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: [''],
      role: ['', Validators.required],
      isActive: [true],
    })
  }

  ngOnInit(): void {
    this.modalInstance = new bootstrap.Modal(document.getElementById('userModal'));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser']) {
      this.populateForm();
    }
  }

  populateForm(): void {
    if (this.selectedUser) {
      this.userForm.patchValue({
        name: this.selectedUser.name,
        lastName: this.selectedUser.lastName,
        email: this.selectedUser.email,
        role: this.selectedUser.role,
        password: ''
      });

      // No es obligatorio en edición
      this.userForm.get('password')?.clearValidators();
    } else {
      this.userForm.reset();
      // Obligatorio en creación
      this.userForm.get('password')?.setValidators(Validators.required);
    }

    this.userForm.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;
    this.error = null; // Limpiar errores anteriores

    const password = this.userForm.value.password?.trim();

    const user: CreateUser = {
      name: this.userForm.value.name,
      lastName: this.userForm.value.lastName,
      email: this.userForm.value.email,
      role: this.userForm.value.role
    };
    if (!this.selectedUser || password) {
      user.password = password;
    }

    this.isLoading = true;

    if(this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, user).subscribe({
        next: () => {
          this.isLoading = false;
          this.closeModal();
          this.showToast('Usuario editado con exito!', 'success');
          this.userSaved.emit(); // Notifica al padre que se guardó correctamente
        },
        error: (err) => {
          this.isLoading = false;
          if(err.error.message == 'Email already in use') {
            this.error = 'El email ya se encuentra en uso'
          } else {
            this.error = 'No se pudo crear el usuario';
          }
          this.showToast('Error al editar el usuario', 'error');
          console.error('Error al guardar usuario:', err);
        }
      });
    } else {
      this.userService.createUser(user).subscribe({
        next: () => {
          this.isLoading = false;
          this.closeModal();
          this.userSaved.emit(); // Notifica al padre que se guardó correctamente
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error al guardar usuario:', err);
          if(err.error.message == 'Email already in use') {
            this.error = 'El email ya se encuentra en uso'
          } else {
            this.error = 'No se pudo crear el usuario';
          }
          // Podés mostrar un toast si querés
        }
      });
    }
  }

  private closeModal() {
    // Cerrar modal usando Bootstrap
    const modalElement = document.getElementById('userModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
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
