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

  deactivateMember(id: number) {
    /*
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */
    return this.http.put<any>(this.apiUrl + `/deactivate/${id}`, {});
  }

  activateMember(id: number) {
    /*
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */
    return this.http.put<any>(this.apiUrl + `/activate/${id}`, {});
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
