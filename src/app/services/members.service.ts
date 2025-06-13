import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member, MemberStatus, MemberType, PutMemberDto } from '../models/member';
import { map, Observable, of } from 'rxjs';
import { MemberMapperPipe } from '../pipes/member-mapper.pipe';
import { PageResponse } from '../models/api-response';

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
      status: 'APPROVED',
      type: 'ATHLETE',
      // teams: []
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
      status: 'APPROVED',
      type: 'ATHLETE',
      // teams: []
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
      status: 'APPROVED',
      type: 'ACTIVE',
      // teams: []
    }
  ];


  apiUrl: string = 'http://localhost:8080/members'

  constructor(private http: HttpClient) {}

  getAllMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl)
  }

  getMembers(page: number = 0, size: number = 10, sortBy: string = 'id', 
           sortDir: string = 'asc', search?: string, status?: string
          ): Observable<PageResponse<Member>> {
    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    
    if (status && status.trim()) {
      params = params.set('status', status);
    }
    
    return this.http.get<PageResponse<Member>>(this.apiUrl + "/filters", { params });
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
    const member = transformPipe.invertTrasnform(memberData);

    console.log("MIEMBRO: ", member);
    return this.http.post<Member>(this.apiUrl, member);
  }

  updateMember(memberId: number, member: Member): Observable<Member | null> {
    /*     
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */

    const memberDto : PutMemberDto = {
      name: member.name,
      last_name: member.lastName,
      email: member.email,
      phone: member.phone,
      address: member.address,
      birthdate: member.birthdate,
      type: member.type
    }
    return this.http.put<Member>(`${this.apiUrl}/${memberId}`, memberDto);
  }

  deleteMember(id: number) {
    /*
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */
    return this.http.delete<any>(this.apiUrl + `/${id}`);
  }

  getPendingMembers(): Observable<Member[]> {

    // pipe
    return this.http.get<Member[]>(this.apiUrl + "/status/PENDING")
    .pipe(
      map((response) => {
        const transformPipe = new MemberMapperPipe();
        return response.map((member: any) =>
          transformPipe.invertTrasnform(member)
        );
      })
    );
  }

  approveMember(memberId: number): Observable<string> {
    /*     
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */
    return this.http.put(`${this.apiUrl}/approve/${memberId}`, null, {
      responseType: 'text'
    });
  }

  rejectMember(memberId: number): Observable<string> {
    /*     
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */
    return this.http.put(`${this.apiUrl}/reject/${memberId}`, null, {
      responseType: 'text'
    });
  }

  validateEmail(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email.toString());

    return this.http.get<boolean>(this.apiUrl + `/validEmail`, { params });
  }

  validateDni(dni: string): Observable<boolean> {
    const params = new HttpParams().set('dni', dni.toString());

    return this.http.get<boolean>(this.apiUrl + `/validDni`, { params });
  }


  // Métodos para obtener opciones de filtros
  getStatusOptions(): string[] {
    return Object.values(MemberStatus);
  }

  getTypeOptions(): string[] {
    return Object.values(MemberType);
  }


}
