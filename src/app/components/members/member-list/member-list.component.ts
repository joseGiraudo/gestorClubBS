import { Component, inject, OnInit } from '@angular/core';
import { Member } from '../../../models/member';
import { MembersService } from '../../../services/members.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-member-list',
  imports: [DatePipe],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {

  members: Member[] = [];

  private membersService = inject(MembersService);

  ngOnInit() {
    this.membersService.getNoticias().subscribe((response) => {
      this.members = response
    })
    
  }

}
