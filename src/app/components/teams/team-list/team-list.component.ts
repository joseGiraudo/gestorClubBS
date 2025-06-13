import { Component, inject, OnInit } from '@angular/core';
import { TeamService } from '../../../services/team.service';
import { Team, translateTeamSport } from '../../../models/team';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { map, Observable } from 'rxjs';
import { User } from '../../../models/user';

@Component({
  selector: 'app-team-list',
  imports: [RouterLink],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.css'
})
export class TeamListComponent implements OnInit {

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
  }

  hasAnyRole(roles: string[]): boolean {
    return this.loginService.hasAnyRole(roles);
  }

  deleteTeam(id: number) {
    this.teamService.deleteTeam(id).subscribe({
      next: () => {
        alert('Equipo eliminado');
        this.loadSportsData(this.sport)
      },
      error: (e) => {
        console.error('Error actualizando socios:', e)
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

}
