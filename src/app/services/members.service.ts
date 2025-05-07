import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../models/member';
import { map, Observable, of } from 'rxjs';
import { MemberMapperPipe } from '../pipes/member-mapper.pipe';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  members: Member[] = [
    {
      id: 1,
      name: 'Juan',
      lastName: 'Pérez',
      dni: '12345678',
      email: 'juan.perez@example.com',
      phone: '123-456-7890',
      address: 'Calle Falsa 123',
      birthdate: new Date('1990-05-15'),
      createdAt: new Date('2025-02-21'),
      isActive: true,
      type: 'ATHLETE'
    },
    {
      id: 2,
      name: 'María',
      lastName: 'Gómez',
      dni: '23456789',
      email: 'maria.gomez@example.com',
      phone: '234-567-8901',
      address: 'Avenida Siempre Viva 742',
      birthdate: new Date('1985-09-30'),
      createdAt: new Date('2025-04-19'),
      isActive: true,
      type: 'ATHLETE'
    },
    {
      id: 3,
      name: 'Carlos',
      lastName: 'Rodríguez',
      dni: '34567890',
      email: 'carlos.rodriguez@example.com',
      phone: '345-678-9012',
      address: 'Boulevard Principal 456',
      birthdate: new Date('1995-12-20'),
      createdAt: new Date('2024-03-28'),
      isActive: true,
      type: 'ACTIVE'
    }
  ];


  apiUrl: string = 'http://localhost:8080/members'

  constructor(private http: HttpClient) {}

  getMembers(): Observable<Member[]> {
    // Para desarrollo, devolvemos datos de ejemplo
    // En producción, descomentar la línea que hace la petición HTTP
    // return of(this.members)

    return this.http.get<Member[]>(this.apiUrl);

    // pipe
    return this.http.get<Member[]>(this.apiUrl)
    .pipe(
      map((response) => {
        const transformPipe = new MemberMapperPipe();
        return response.map((member: any) =>
          transformPipe.transform(member)
        );
      })
    );
  }

  getMemberById(id: number): Observable<Member> {
    
    return this.http.get<Member>(this.apiUrl + "/" + id);
  }

  createMember(memberData: Member): Observable<Member | null> {
    /*     
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */

    const transformPipe = new MemberMapperPipe();
    const member = transformPipe.inverttrasnform(memberData);
    return this.http.post<Member>(this.apiUrl, member);
  }

  updateMember(memberId: number, memberData: Member): Observable<Member | null> {
    /*     
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */

    const transformPipe = new MemberMapperPipe();
    const member = transformPipe.inverttrasnform(memberData);
    return this.http.post<Member>(`${this.apiUrl}/${memberId}`, member);
  }

  deleteMember(id: number) {
    /*
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */
    return this.http.delete<any>(this.apiUrl + `/${id}`);
  }
}
