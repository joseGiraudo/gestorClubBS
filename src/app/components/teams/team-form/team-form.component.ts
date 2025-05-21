import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamService } from '../../../services/team.service';
import { CreateTeam, TeamSport, translateTeamSport } from '../../../models/team';
import { error } from 'console';

@Component({
  selector: 'app-team-form',
  imports: [ReactiveFormsModule],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.css'
})
export class TeamFormComponent {

  teamForm: FormGroup;

  translateTeamSport = translateTeamSport;
  sportsArray = Object.values(TeamSport);


  private teamService = inject(TeamService);

  constructor(private fb: FormBuilder) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      sport: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.teamForm.invalid) return;


    const team: CreateTeam = {
      name: this.teamForm.get('name')?.value,
      description: this.teamForm.get('description')?.value,
      sport: this.teamForm.get('sport')?.value,
    };

    console.log("Team a cargar: ", team);

    this.teamService.createTeam(team).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('Operación completada');
      }
    });
  }
}