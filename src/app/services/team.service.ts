import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateTeam, Team, TeamSport } from '../models/team';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  apiUrl: string = 'http://localhost:8080/teams'

  constructor(private http: HttpClient) {}

  getTeams(): Observable<Team[]> {

    return this.http.get<Team[]>(this.apiUrl)
  }

  getTeamById(id: number): Observable<Team> {
    
    return this.http.get<Team>(this.apiUrl + "/" + id);
  }

  createTeam(teamData: CreateTeam): Observable<Team | null> {
    /*     
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */

    console.log("Equipo: ", teamData);

    return this.http.post<Team>(this.apiUrl, teamData);
  }

  updateTeam(memberId: number, teamData: CreateTeam): Observable<Team | null> {
    /*     
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */
    return this.http.post<Team>(`${this.apiUrl}/${memberId}`, teamData);
  }

  deleteTeam(id: number) {
    /*
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */
    return this.http.delete<any>(this.apiUrl + `/${id}`);
  }

  getTeamsBySport(sport: TeamSport | string): Observable<Team[]> {
    
    return this.http.get<Team[]>(this.apiUrl + "/sport/" + sport);
  }
}
