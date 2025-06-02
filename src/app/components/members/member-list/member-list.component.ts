import { Component, inject, type OnInit } from "@angular/core"
import { type Member, MemberStatus, translateMemberStatus } from "../../../models/member"
import { MembersService } from "../../../services/members.service"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

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
  selectedIsActive: boolean | null = null
  sortBy = "id"
  sortDir = "asc"

  // Estados
  loading = false

  // Opciones para filtros
  statusOptions = Object.values(MemberStatus)
  activeOptions = [
    { value: null, label: "Todos" },
    { value: true, label: "Activos" },
    { value: false, label: "Inactivos" },
  ]

  // Exponer MemberStatus para el template
  MemberStatus = MemberStatus

  // traductor de enum
  translateMemberStatus = translateMemberStatus

  private membersService = inject(MembersService)

  ngOnInit() {
    this.loadMembers()
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
        this.selectedIsActive !== null ? this.selectedIsActive : undefined,
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

  onActiveFilterChange() {
    this.currentPage = 0
    this.loadMembers()
  }

  // Limpiar filtros
  clearFilters() {
    this.searchTerm = ""
    this.selectedStatus = ""
    this.selectedIsActive = null
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

  // Formateo de datos para la vista
  getFullName(member: Member): string {
    return `${member.name} ${member.lastName}`
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("es-AR")
  }

  getStatusClass(status: MemberStatus | string): string {
    switch (status) {
      case MemberStatus.APPROVED:
        return "badge bg-success"
      case MemberStatus.REJECTED:
        return "badge bg-danger"
      case MemberStatus.PENDING:
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
        this.loadMembers() // Recargar la lista
      },
      error: (error) => {
        console.error("Error al aprobar miembro:", error)
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
}
