import { Member } from "./member";

export interface Team {
  id: number;
  name: string;
  description: string;
  sport: string;
  members: Member[]
}

export interface CreateTeam {
  name: string;
  description: string;
  sport: string;
}

export enum TeamSport {
  BASKETBALL = 'BASKETBALL',
  FOOTBALL = 'FOOTBALL',
  HOCKEY = 'HOCKEY',
  VOLLEYBALL = 'VOLLEYBALL'
}

export function translateTeamSport(sport: TeamSport | string): string {
  switch (sport) {
    case TeamSport.BASKETBALL:
      return 'Básquet';
    case TeamSport.FOOTBALL:
      return 'Fútbol';
    case TeamSport.HOCKEY:
      return 'Hockey';
    case TeamSport.VOLLEYBALL:
      return 'Vóley';
    default:
      return 'Deporte';
  }
}