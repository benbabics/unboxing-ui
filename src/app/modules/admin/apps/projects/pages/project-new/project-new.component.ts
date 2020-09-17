import { Component } from '@angular/core';
import { ProjectFormView } from '../../components';

@Component({
  selector: 'project-new',
  templateUrl: './project-new.component.html',
  styleUrls: ['./project-new.component.scss']
})
export class ProjectNewComponent {

  ProjectFormView = ProjectFormView;

  activeView: ProjectFormView;
  
  constructor() {
    this.activeView = ProjectFormView.Wizard;
  }
}
