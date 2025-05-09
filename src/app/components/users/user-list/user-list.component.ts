import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  private userService = inject(UserService);

  ngOnInit() {
    this.userService.getUsers().subscribe((response) => {
      console.log(response);
      this.users = response
    })
  }

  editUser(id: any) {
    console.log("Editar User con id: " + id)
  }

  deleteUser(id: any) {
    console.log("Eliminar User con id: " + id)
  }

  activateUser(id: any) {
    console.log("Activar User con id: " + id)
  }
}