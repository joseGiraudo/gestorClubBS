import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../models/user';
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

  createUser(userDate: User):Observable<User>  {

    const transformPipe = new UserMapperPipe();
        const member = transformPipe.invertTrasnform(userDate);
    
        console.log("User: ", member);
        return this.http.post<User>(this.apiUrl, member);
  }

}
