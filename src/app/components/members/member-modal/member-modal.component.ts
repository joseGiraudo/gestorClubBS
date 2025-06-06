import { Component, Input } from '@angular/core';
import { Member, translateMemberStatus } from '../../../models/member';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-modal',
  imports: [CommonModule],
  templateUrl: './member-modal.component.html',
  styleUrl: './member-modal.component.css'
})
export class MemberModalComponent {

  @Input() selectedMember: Member | null = null;

  translateMemberStatus = translateMemberStatus;

  // En tu componente
getStatusClass(status: string): string {
  switch(status) {
    case 'ACTIVE':
      return 'bg-success';
    case 'PENDING':
      return 'bg-warning';
    case 'INACTIVE':
      return 'bg-danger';
    case 'REJECTED':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
}

}
