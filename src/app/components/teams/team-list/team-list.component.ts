import { Component, inject, OnInit } from '@angular/core';
import { TeamService } from '../../../services/team.service';
import { Team, translateTeamSport } from '../../../models/team';
import { response } from 'express';
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

  sport: string | null = null;

  translateTeamSport = translateTeamSport;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {

    this.sport = this.activatedRoute.snapshot.paramMap.get('sport');

    if(this.sport) {
      this.teamService.getTeamsBySport(this.sport).subscribe((response) => {
        this.teamsArray = response
      })
    }   
  }

  formatDate(date: Date): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString("es-AR")
  }

}
