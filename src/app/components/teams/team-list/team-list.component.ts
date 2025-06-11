import { Component, inject, OnInit } from '@angular/core';
import { TeamService } from '../../../services/team.service';
import { Team, translateTeamSport } from '../../../models/team';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team-list',
  imports: [],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.css'
})
export class TeamListComponent implements OnInit {

  private teamService = inject(TeamService);

  teamsArray : Team[] = [];

  sport: string = '';

  translateTeamSport = translateTeamSport;

  constructor(private activatedRoute: ActivatedRoute) {}

   ngOnInit() {
    // Escuchar cambios en el parámetro 'sport'
    this.activatedRoute.params.subscribe(params => {
      this.sport = params['sport'];
      this.loadSportsData(this.sport); // Lógica para cargar los datos según el deporte
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

}
