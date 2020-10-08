import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClearActive, Reset, SetActive } from '@ngxs-labs/entity-state';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ProjectInvitation, ProjectInvitationState, ProjectMember, ProjectMemberState, ProjectState } from '../../../../../../../../projects/lib-common/src/public-api';

@Component({
  selector: 'project-detail',
  template: `<router-outlet></router-outlet>`
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  
  constructor(
    private _store: Store,
    private _activatedRoute: ActivatedRoute,
  ) { }
  
  ngOnInit() {
    this._activatedRoute.params
      .pipe(
        takeUntil( this._destroy$ ),
        tap(params => this._store.dispatch([
          new SetActive( ProjectState, params.id ),
          new ProjectInvitation.Index( params.id ),
          new ProjectMember.Index( params.id ),
        ])),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();

    this._store.dispatch([
      new ClearActive( ProjectState ),
      new Reset( ProjectInvitationState ),
      new Reset( ProjectMemberState ),
    ]);
  }
}
