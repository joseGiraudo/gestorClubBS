import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CreateUser, User } from '../models/user';
import { UserMapperPipe } from '../pipes/user-mapper.pipe';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  getUsers():Observable<User[]> {

    return this.http.get<User[]>(this.apiUrl)
    .pipe(
          map((response) => {
            const transformPipe = new UserMapperPipe();
            return response.map((member: any) =>
              transformPipe.transform(member)
            );
          })
        );;
  }

  createUser(userData: CreateUser):Observable<User>  {

    const user = {
      name: userData.name,
      last_name: userData.lastName,
      email: userData.email,
      password: userData.password,
      role: userData.role
    }

    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: any, userData: CreateUser):Observable<User>  {

    const user = {
      name: userData.name,
      last_name: userData.lastName,
      email: userData.email,
      password: userData.password,
      role: userData.role
    }

    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number) {
    /*
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */
    return this.http.delete<any>(this.apiUrl + `/${id}`, {});
  }

  activateUser(id: number) {
    /*
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */
    return this.http.put<any>(this.apiUrl + `/activate/${id}`, {});
  }

}
