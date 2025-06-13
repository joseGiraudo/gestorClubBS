import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamService } from '../../../services/team.service';
import { CreateTeam, TeamSport, translateTeamSport } from '../../../models/team';
import { error } from 'console';
import { Member } from '../../../models/member';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../../services/members.service';
import { CommonModule } from '@angular/common';

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

  translateTeamSport = translateTeamSport;
  sportsArray = Object.values(TeamSport);


  private teamService = inject(TeamService);
  private memberService = inject(MembersService);

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute,) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      sport: ['', Validators.required]
    });
  }

  ngOnInit(): void {
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
      this.teamService.updateTeam(this.teamId, team).subscribe({
        next: () => {
          this.teamService.updateTeamMembers(this.teamId!, memberIds).subscribe({
            next: () => console.log('Socios actualizados correctamente'),
            error: (e) => console.error('Error actualizando socios:', e),
            complete: () => console.log('Actualización completa')
          });
        },
        error: (e) => console.error('Error actualizando equipo:', e)
      });
    } else {
      // MODO CREACIÓN
      this.teamService.createTeam(team).subscribe({
        next: (createdTeam) => {
          console.log("Equipo creado:", createdTeam);

          if (memberIds.length > 0) {
            this.teamService.updateTeamMembers(createdTeam.id, memberIds).subscribe({
              next: () => console.log('Socios asignados correctamente'),
              error: (e) => console.error('Error asignando socios:', e),
              complete: () => console.log('Asignación de socios completa')
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
}