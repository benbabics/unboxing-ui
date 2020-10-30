import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil, tap, map } from 'rxjs/operators';
import { EntityActionType, ofEntityActionSuccessful, Reset } from '@ngxs-labs/entity-state';
import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Select, Actions, Store } from '@ngxs/store';
import { Project, ProjectInvitation, ProjectInvitationState, ProjectMember, ProjectMembershipState, ProjectState, ProjectUserState } from '@libCommon';

@Component({
  selector: 'project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnDestroy {

  private _destroy$ = new Subject();
  
  @Select( ProjectState.active ) project$: Observable<Project>;

  constructor(
    actions$: Actions,
    snackBar: MatSnackBar,
    private _store: Store,
    private _router: Router,
  ) {
    this._store.dispatch([
      new ProjectMember.Index(),
      new ProjectInvitation.Index(),
    ]);
    
    actions$.pipe(
      ofEntityActionSuccessful( ProjectState, EntityActionType.Update ),
      takeUntil( this._destroy$ ),
      map(({ payload }) => payload.data),
      tap(({ title }) => snackBar.open( `${ title } was updated successfully.`, `Ok` )),
      tap(({ id }) => _router.navigate([ '/projects', id ])),
    )
    .subscribe();
  }
  
  handleCancel(): void {
    this._router.navigateByUrl( "../" );
  }

  handleSubmit(project): void {
    this._store.dispatch( new Project.Update(project) );
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();

    this._store.dispatch([
      new Reset( ProjectUserState ),
      new Reset( ProjectInvitationState ),
      new Reset( ProjectMembershipState ),
    ]);
  }
}
