import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { Project, ProjectState } from '../../../../../../../../projects/lib-common/src/public-api';

@Component({
  selector: 'project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent {

  @Select( ProjectState.active ) project$: Observable<Project>;
  
  handleCancel(): void {
    console.log('* handleCancel');
  }

  handleSubmit(project): void {
    console.log('* handleSubmit');
  }
}
