import { AfterViewInit, Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { translateUserRole, User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { UserFormComponent } from "../user-form/user-form.component";
import { isPlatformBrowser } from '@angular/common';
import { LoginService } from '../../../services/login.service';

declare var bootstrap: any;

@Component({
  selector: 'app-user-list',
  imports: [UserFormComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, AfterViewInit {

  users: User[] = [];
  selectedUser: User | null = null;
  currentUser: User | null = null;

  loading = true;

  private userService = inject(UserService);

  translateUserRole = translateUserRole;

    // toast  
  private toastElement: any;
  private toast: any;
  
  // modal de confirmacion
  private modal: any;
  modalMessage: string = '¿Seguro quieres realizar la acción?';
  modalTitle: string = 'Confirmar';
  modalAction: 'activate' | 'deactivate' | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private loginService: LoginService
  ) {}


  ngOnInit() {
    this.currentUser = this.loginService.getCurrentUser();
    this.loadUsers();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const modalElement = document.getElementById('confirmModal');
      if (modalElement) {
        this.modal = new bootstrap.Modal(modalElement);
      }

      // Toast con delay por si todavía no se montó
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

  loadUsers() {
    this.userService.getUsers().subscribe((response) => {
      console.log(response);
      this.users = response
      this.loading = false;
    })
  }

  openCreateUserModal() {
    this.selectedUser = null;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const modalElement = document.getElementById('userModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      });
    }
  }

  openEditUserModal(user: User) {
    this.selectedUser = user;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const modalElement = document.getElementById('userModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      });
    }
  }

  deactivateUser(id: any) {
    this.userService.deleteUser(id).subscribe({
      next: (response) => {
        console.log(response);
        this.showToast('Usuario desactivado', 'success')
      },
      error: (err) => {
        console.log(err);
        this.showToast('Error al desactivar el usuario', 'error')        
      },
      complete: () => {
        this.loadUsers();
      }
    })
  }

  activateUser(id: any) {
    this.userService.activateUser(id).subscribe({
      next: (response) => {
        console.log(response);
        this.showToast('Usuario activado', 'success')
      },
      error: (err) => {
        console.log(err);
        this.showToast('Error al activar el usuario', 'error')        
      },
      complete: () => {
        this.loadUsers();
      }
    })
  }

  openDeleteModal(user: User) {
      this.selectedUser = user;
      this.modalAction = 'deactivate';
      this.modalTitle = 'Confirmación';
      this.modalMessage = `¿Desea marcar a ${user.name} ${user.lastName}, rol: ${translateUserRole(user.role)} como Inactivo?`
      
      setTimeout(() => {
        const modalEl = document.getElementById('confirmModal');
        if (modalEl) {
          this.modal = new bootstrap.Modal(modalEl);
          this.modal.show();
        }
      });
    }

    openActivateModal(user: User) {
      this.selectedUser = user;
      this.modalAction = 'activate';
      this.modalTitle = 'Confirmación';
      this.modalMessage = `¿Desea marcar a ${user.name} ${user.lastName}, rol: ${translateUserRole(user.role)} como Activo?`
      
      setTimeout(() => {
        const modalEl = document.getElementById('confirmModal');
        if (modalEl) {
          this.modal = new bootstrap.Modal(modalEl);
          this.modal.show();
        }
      });
    }

    modalConfirm(): void {
    if (this.selectedUser && this.modalAction) {
      switch(this.modalAction) {
        case "activate":
          this.activateUser(this.selectedUser.id);
          break;
        case "deactivate":
          this.deactivateUser(this.selectedUser.id);
          break;
      }      
    }
    // Limpiar estado y cerrar el modal
    this.selectedUser = null;
    this.modalAction = null;
    this.modal.hide();
  }

  
  // Método para mostrar toast
  private showToast(message: string, type: 'success' | 'error' | 'loading'): void {
    
    if (!isPlatformBrowser(this.platformId)) return;

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
      //this.toast.show();
      const toast = new bootstrap.Toast(toastContainer, {
        delay: 4000,
        autohide: true,
      });
      toast.show();
    }
  }

}