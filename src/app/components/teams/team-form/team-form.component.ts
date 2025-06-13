import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamService } from '../../../services/team.service';
import { CreateTeam, TeamSport, translateTeamSport } from '../../../models/team';
import { Member } from '../../../models/member';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../../services/members.service';

declare var bootstrap: any; // Para usar Bootstrap modal


@Component({
  selector: 'app-team-form',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.css'
})
export class TeamFormComponent implements OnInit {

  teamForm: FormGroup;
  isEditMode = false;
  teamId: number | null = null;

  members: Member[] = [];
  selectedMembers: Member[] = [];
  searchTerm = '';

  private toastElement: any;
  private toast: any;

  translateTeamSport = translateTeamSport;
  sportsArray = Object.values(TeamSport);


  private teamService = inject(TeamService);
  private memberService = inject(MembersService);

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      sport: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    // Inicializar el toast
    this.toastElement = document.getElementById('responseToast');
    if (this.toastElement) {
      this.toast = new bootstrap.Toast(this.toastElement, {
        autohide: true,
        delay: 4000 // 4 segundos
      });
    }


    if (this.activatedRoute.snapshot.params['id']) {
      this.isEditMode = true;
      this.teamId = +this.activatedRoute.snapshot.params['id'];

      this.teamService.getTeamById(this.teamId).subscribe(team => {
        this.teamForm.patchValue(team);
        this.selectedMembers = team.members; // Asegurate que el backend devuelva los miembros
      });
    }

    this.searchMembers();
  }

  onSubmit() {
    if (this.teamForm.invalid) return;

    const team: CreateTeam = {
      name: this.teamForm.get('name')?.value,
      description: this.teamForm.get('description')?.value,
      sport: this.teamForm.get('sport')?.value,
    };

    const memberIds = this.selectedMembers.map(m => m.id);

    if (this.isEditMode && this.teamId) {
      //MODO EDICIÓN
      this.showToast('Editando Equipo', 'loading');
      this.teamService.updateTeam(this.teamId, team).subscribe({
        next: () => {
          this.teamService.updateTeamMembers(this.teamId!, memberIds).subscribe({
            next: () => {
              console.log('Socios actualizados correctamente');
            },
            error: (e) => console.error('Error actualizando socios:', e),
            complete: () => {
              console.log('Actualización completa')
              this.showToast('Equipo actualizado con éxito', 'success');
              this.router.navigate(['/teams/', team.sport])
            }
          });
        },
        error: (e) => console.error('Error actualizando equipo:', e)
      });
    } else {
      // MODO CREACIÓN
      this.showToast('Creando Equipo', 'loading');
      this.teamService.createTeam(team).subscribe({
        next: (createdTeam) => {
          console.log("Equipo creado:", createdTeam);

          if (memberIds.length > 0) {
            this.teamService.updateTeamMembers(createdTeam.id, memberIds).subscribe({
              next: () => console.log('Socios asignados correctamente'),
              error: (e) => console.error('Error asignando socios:', e),
              complete: () => {
                console.log('Asignación de socios completa');
                this.showToast('Equipo creado con éxito', 'success');     
                this.router.navigate(['/teams/', team.sport]);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error creando equipo:', error);
        },
        complete: () => {
          console.log('Operación completada');
        }
      });
    }
  }

  searchMembers() {
    this.memberService.getMembers(0, 10, 'lastName', 'asc', this.searchTerm).subscribe(
      response => {
        this.members = response.content;
        // Podés usar response.totalElements y response.totalPages si querés paginación visual
      }
    );
  }

  isMemberSelected(memberId: number): boolean {
    return this.selectedMembers.some(m => m.id === memberId);
  }


  addMemberToTeam(member: Member) {
    if (!this.selectedMembers.some(m => m.id === member.id)) {
      this.selectedMembers.push(member);
    }
  }

  removeMember(memberId: number) {
    this.selectedMembers = this.selectedMembers.filter(m => m.id !== memberId);
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