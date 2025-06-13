import { Component, inject, OnInit } from '@angular/core';
import { TeamService } from '../../../services/team.service';
import { Team, translateTeamSport } from '../../../models/team';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { map, Observable } from 'rxjs';
import { User } from '../../../models/user';

declare var bootstrap: any;

@Component({
  selector: 'app-team-list',
  imports: [RouterLink],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.css'
})
export class TeamListComponent implements OnInit {

    // toast  
  private toastElement: any;
  private toast: any;
  
  // modal de confirmacion
  private modal: any;
  modalMessage: string = '¿Seguro quieres realizar la acción?';
  modalTitle: string = 'Confirmar';
  teamToDelete: Team | null = null;

  private teamService = inject(TeamService);
  
  isLoggedIn$: Observable<boolean>;
  user$: Observable<User | null>;

  teamsArray : Team[] = [];

  sport: string = '';

  translateTeamSport = translateTeamSport;

  constructor(private activatedRoute: ActivatedRoute, private loginService: LoginService) {
    this.isLoggedIn$ = this.loginService.currentUser$.pipe(
      // Mapeamos para saber si hay usuario
      map(user => !!user)
    );
    this.user$ = this.loginService.currentUser$;
  }

  ngOnInit() {
    // Escuchar cambios en el parámetro 'sport'
    this.activatedRoute.params.subscribe(params => {
      this.sport = params['sport'];
      this.loadSportsData(this.sport); // Lógica para cargar los datos según el deporte
    });

    this.modal = new bootstrap.Modal(document.getElementById('confirmModal'));
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

  hasAnyRole(roles: string[]): boolean {
    return this.loginService.hasAnyRole(roles);
  }

  deleteTeam(id: number) {
    this.teamService.deleteTeam(id).subscribe({
      next: () => {
        this.showToast('Equipo eliminado', 'success')
        this.loadSportsData(this.sport)
      },
      error: (e) => {
        console.error('Error actualizando socios:', e)
        this.showToast('Error al eliminar el equipo', 'error')
      }
    });
  }
  
  loadSportsData(sport: string) {
      this.teamService.getTeamsBySport(sport).subscribe((response) => {
      this.teamsArray = response;
    })
  }
  
  formatDate(date: Date): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString("es-AR")
  }


    openModal(team: Team) {
      this.teamToDelete = team;
      this.modalTitle = 'Confirmación';
      this.modalMessage = `¿Desea eliminar el equipo ${team.name}?`
      this.modal.show();
    }
  
    modalConfirm(): void {
      if(this.teamToDelete) {
        this.deleteTeam(this.teamToDelete.id)
      }
      this.modal.hide();
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
