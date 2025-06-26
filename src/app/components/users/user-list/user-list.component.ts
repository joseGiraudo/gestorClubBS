import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { translateUserRole, User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { UserFormComponent } from "../user-form/user-form.component";
import { isPlatformBrowser } from '@angular/common';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}


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
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const modalElement = document.getElementById('userModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      });
    }
  }

  openEditUserModal(user: User) {
    this.selectedUser = user;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const modalElement = document.getElementById('userModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      });
    }
  }

  deleteUser(id: any) {
    console.log("Eliminar User con id: " + id)
  }

  activateUser(id: any) {
    console.log("Activar User con id: " + id)
  }
}