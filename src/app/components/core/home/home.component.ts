import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { News } from '../../../models/news';
import { NewsService } from '../../../services/news.service';
import { TeamService } from '../../../services/team.service';
import { Team, TeamSport, translateTeamSport } from '../../../models/team';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  translateTeamSport = translateTeamSport;

  private newsService = inject(NewsService);
  private teamService = inject(TeamService);

  newsArray: News[] = []
  teamsArray: Team[] = [];

  

  ngOnInit(): void {
    this.newsService.getNews().subscribe((news) => {
      this.newsArray = news
    })

    this.teamService.getTeams().subscribe((teams) => {
      this.teamsArray = teams;
      console.log(teams);
    })
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("es-AR")
  }

}
