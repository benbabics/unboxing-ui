import { Component, Input } from '@angular/core';
import { ProjectMembership } from 'app/data';

@Component({
  selector: 'member-table',
  templateUrl: './member-table.component.html',
  styleUrls: ['./member-table.component.scss'],
  host: { 'class': 'w-full' }
})
export class MemberTableComponent {

  @Input() members: ProjectMembership[];
  
  columnsToDisplay = [ 'avatar', 'lastname', 'firstname', 'email', 'role' ];
  
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
