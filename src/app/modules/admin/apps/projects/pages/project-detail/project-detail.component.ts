import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClearActive, Reset, SetActive } from '@ngxs-labs/entity-state';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ProjectActive, ProjectState } from 'app/data';

@Component({
  selector: 'project-detail',
  template: `<router-outlet></router-outlet>`
})
export class ProjectDetailComponent implements OnDestroy {

  private _destroy$ = new Subject();
  
  constructor(
    private _store: Store,
    activatedRoute: ActivatedRoute,
  ) {
    activatedRoute.params.pipe(
      takeUntil( this._destroy$ ),
      tap(({ id }) => _store.dispatch( new SetActive(ProjectState, id) )),
    )
    .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();

    this._store.dispatch([
      new ClearActive( ProjectState ),
      new ProjectActive.ClearAssociations(),
    ]);
  }
}
