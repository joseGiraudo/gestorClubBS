import { Component, inject, type OnInit } from "@angular/core"
import { type Member, MemberStatus, translateMemberStatus } from "../../../models/member"
import { MembersService } from "../../../services/members.service"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

declare var bootstrap: any;

@Component({
  selector: "app-member-list",
  imports: [CommonModule, FormsModule],
  templateUrl: "./member-list.component.html",
  styleUrl: "./member-list.component.css",
})
export class MemberListComponent implements OnInit {
  members: Member[] = []

  // Parámetros de paginación
  currentPage = 0
  pageSize = 10
  totalElements = 0
  totalPages = 0

  // Filtros y ordenamiento
  searchTerm = ""
  selectedStatus = ""
  sortBy = "id"
  sortDir = "asc"

  // Estados
  loading = false;
  filtersExpanded: boolean = false;

  // Opciones para filtros
  statusOptions = Object.values(MemberStatus)

  // Exponer MemberStatus para el template
  MemberStatus = MemberStatus

  // traductor de enum
  translateMemberStatus = translateMemberStatus

  // toast  
  private toastElement: any;
  private toast: any;

  private membersService = inject(MembersService)

  ngOnInit() {
    this.loadMembers();
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

  loadMembers() {
    this.loading = true    

    this.membersService
      .getMembers(
        this.currentPage,
        this.pageSize,
        this.sortBy,
        this.sortDir,
        this.searchTerm || undefined,
        this.selectedStatus || undefined,
      )
      .subscribe({
        next: (response) => {
          this.members = response.content
          this.totalElements = response.totalElements
          this.totalPages = response.totalPages
          this.loading = false
        },
        error: (error) => {
          console.error("Error loading members:", error)
          this.loading = false
          // Aquí podrías mostrar un mensaje de error al usuario
        },
      })
  }

  // Navegación de páginas
  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page
      this.loadMembers()
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
    this.loadMembers()
  }

  onStatusFilterChange() {
    this.currentPage = 0
    this.loadMembers()
  }

  // Limpiar filtros
  clearFilters() {
    this.searchTerm = ""
    this.selectedStatus = ""
    this.currentPage = 0
    this.loadMembers()
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
    this.loadMembers()
  }

  // Cambio de tamaño de página
  onPageSizeChange(newSize: number | string) {
    this.pageSize = typeof newSize === "string" ? Number.parseInt(newSize, 10) : newSize
    this.currentPage = 0
    this.loadMembers()
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
      this.searchTerm ||
      this.selectedStatus
    );
  }

  // Formateo de datos para la vista
  getFullName(member: Member): string {
    return `${member.name} ${member.lastName}`
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("es-AR")
  }

  getStatusClass(status: MemberStatus | string): string {
    switch (status) {
      case 'ACTIVE':
        return "badge bg-success"
      case 'REJECTED':
        return "badge bg-danger"
      case 'INACTIVE':
        return "badge bg-danger"
      case 'PENDING':
        return "badge bg-warning"
      default:
        return "badge bg-secondary"
    }
  }

  // Acciones de miembros
  viewMember(id: any) {
    console.log("Ver detalles del miembro con id: " + id)
    // Implementar navegación a vista de detalles
  }

  approveMember(id: any) {
    this.membersService.approveMember(id).subscribe({
      next: (response) => {
        console.log("Miembro aprobado:", response)
        this.showToast('¡Socio aprobado correctamente!', 'success');
        this.loadMembers() // Recargar la lista
      },
      error: (error) => {
        console.error("Error al aprobar miembro:", error);
        this.showToast('Hubo un error al aprobar el socio', 'error');
      },
    })
  }

  editMember(id: any) {
    console.log("Editar miembro con id: " + id)
    // Implementar navegación a formulario de edición
  }

  deleteMember(id: any) {
    if (confirm("¿Está seguro de que desea eliminar este miembro?")) {
      console.log("Eliminar miembro con id: " + id)
      // Implementar eliminación
    }
  }

  activateMember(id: any) {
    console.log("Activar miembro con id: " + id)
    // Implementar activación
    this.loadMembers() // Recargar después de la acción
  }

  deactivateMember(id: any) {
    if (confirm("¿Está seguro de que desea desactivar este miembro?")) {
      console.log("Desactivar miembro con id: " + id)
      // Implementar desactivación
      this.loadMembers() // Recargar después de la acción
    }
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
