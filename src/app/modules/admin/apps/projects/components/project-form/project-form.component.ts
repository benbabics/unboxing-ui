import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

export enum ProjectFormView {
  Wizard   = "PROJECT_VIEW_WIZARD",
  Advanced = "PROJECT_VIEW_ADVANCED",
}

@Component({
  selector: 'project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnChanges, OnDestroy {

  private _destroy$ = new Subject();
  
  ProjectFormView = ProjectFormView;
  manageProjectForm: FormGroup;

  @Input()  activeView: ProjectFormView = ProjectFormView.Advanced;
  @Output() activeViewChange = new EventEmitter<ProjectFormView>();

  constructor() {
    this._buildForm();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }
  
  ngOnChanges({ activeView }: SimpleChanges) {
    this.updateActiveView( activeView.currentValue );
  }

  updateActiveView(activeView: ProjectFormView): void {
    if ( activeView === ProjectFormView.Wizard ) {
      // this.wizard.restart();
    }

    this.activeView = activeView;
    this.activeViewChange.emit( this.activeView );
  }

  private _buildForm(): void {
    this.manageProjectForm = new FormGroup({
      step1: new FormGroup({
        title: new FormControl('', [ Validators.required ]),
      }),
      step2: new FormGroup({
        slug: new FormControl('', [ Validators.required ]),
      }),
      step3: new FormGroup({ }),
    });
  }
}
