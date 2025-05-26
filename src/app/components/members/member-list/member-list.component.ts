import { Component, inject, OnInit } from '@angular/core';
import { Member, translateMemberStatus } from '../../../models/member';
import { MembersService } from '../../../services/members.service';
import { DatePipe } from '@angular/common';
import { response } from 'express';

@Component({
  selector: 'app-member-list',
  imports: [DatePipe],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {

  members: Member[] = [];

  translateMemberStatus = translateMemberStatus;

  private membersService = inject(MembersService);

  ngOnInit() {
    this.membersService.getMembers().subscribe((response) => {
      console.log(response);
      this.members = response
    })
    
  }

  approveMember(id: any) {
    this.membersService.approveMember(id).subscribe((response) => {
      console.log(response);
    })
  }

  editMember(id: any) {
    console.log("Editar Memeber con id: " + id)
  }

  deleteMember(id: any) {
    console.log("Eliminar Memeber con id: " + id)
  }

  activateMember(id: any) {
    console.log("Activar Memeber con id: " + id)
  }
}
