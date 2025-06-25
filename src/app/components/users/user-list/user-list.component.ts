import { Component, inject, OnInit } from '@angular/core';
import { translateUserRole, User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { UserFormComponent } from "../user-form/user-form.component";

declare var bootstrap: any;

@Component({
  selector: 'app-user-list',
  imports: [UserFormComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  selectedUser: User | null = null;

  loading = true;

  private userService = inject(UserService);

  translateUserRole = translateUserRole;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((response) => {
      console.log(response);
      this.users = response
      this.loading = false;
    })
  }

  openCreateUserModal() {
    this.selectedUser = null;
    setTimeout(() => {
      const modal = new bootstrap.Modal(document.getElementById('userModal'));
      modal.show();
    });
  }

  openEditUserModal(user: User) {
    this.selectedUser = user;
    setTimeout(() => {
      const modal = new bootstrap.Modal(document.getElementById('userModal'));
      modal.show();
    });
  }

  deleteUser(id: any) {
    console.log("Eliminar User con id: " + id)
  }

  activateUser(id: any) {
    console.log("Activar User con id: " + id)
  }
}