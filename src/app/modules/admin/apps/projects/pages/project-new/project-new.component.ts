import { takeUntil, tap } from 'rxjs/operators';
import { ofEntityActionSuccessful, EntityActionType } from '@ngxs-labs/entity-state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store, Actions } from '@ngxs/store';
import { Component, OnDestroy } from '@angular/core';
import { Project, ProjectState } from '../../../../../../../../projects/lib-common/src/lib/states';
import { ProjectFormView } from '../../components';
import { Subject } from 'rxjs';

@Component({
  selector: 'project-new',
  templateUrl: './project-new.component.html',
  styleUrls: ['./project-new.component.scss']
})
export class ProjectNewComponent implements OnDestroy {

  private _destroy$ = new Subject();
  
  ProjectFormView = ProjectFormView;

  activeView: ProjectFormView;
  
  constructor(
    actions$: Actions,
    snackBar: MatSnackBar,
    private _store: Store,
    private _router: Router,
  ) {
    this.activeView = ProjectFormView.Wizard;

    actions$.pipe(
      ofEntityActionSuccessful( ProjectState, EntityActionType.Add ),
      takeUntil( this._destroy$ ),
      tap(({ payload }) => snackBar.open( `${ payload.title } was created successfully.`, `Ok` )),
      tap(({ payload }) => _router.navigate([ '/projects', payload.id ])),
    )
    .subscribe();
  }

  handleCancel(): void {
    this._router.navigateByUrl( "/projects" );
  }

  handleSubmit(project: Project): void {
    this._store.dispatch( new Project.Create(project) );
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }
}
