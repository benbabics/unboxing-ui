import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { toPairs, set } from 'lodash';
import { Subject } from 'rxjs';
import { map, takeUntil, tap, flatMap, switchMap, withLatestFrom, skip } from 'rxjs/operators';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { SearchProject, SearchProjectState } from './../../states';

@Component({
  selector: 'project-filters',
  templateUrl: './project-filters.component.html',
  styleUrls: ['./project-filters.component.scss']
})
export class ProjectFiltersComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  
  projectFiltersForm: FormGroup;
  
  constructor(
    actions$: Actions,
    private _store: Store,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    this._buildForm();
    
    // on SearchProject.SetFilters, update the URL queryParams
    actions$.pipe(
      takeUntil( this._destroy$ ),
      ofActionSuccessful( SearchProject.SetFilters ),
      withLatestFrom( _store.select( SearchProjectState.filters )),
      map(([ payload, filters ]) => filters),
      map(queryParams => ({ queryParams, queryParamsHandling: 'merge' })),
      tap(queryParams => _router.navigate( [], <any>queryParams )),
    )
    .subscribe();
  }

  ngOnInit() {
    const queryParams = this._activatedRoute.snapshot.queryParams;
    this._store.dispatch( new SearchProject.SetFilters(queryParams) );
    
    // on queryParam updates, update ngxs form state
    this._activatedRoute.queryParams.pipe(
      takeUntil( this._destroy$ ),
      map(params => toPairs( params )),
      map(pairs  => pairs.reduce((model, [k,v]) => set(model,k,v), {})),
      tap(value  => this._store.dispatch(
        new UpdateFormValue({ value, path: 'searchProject.projectFiltersForm' })
      )),
    )
    .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  handleSubmit(): void {
    const filters = this.projectFiltersForm.getRawValue();
    this._store.dispatch( new SearchProject.Search(filters) );
  }

  private _buildForm(): void {
    this.projectFiltersForm = new FormGroup({
      brand: new FormGroup({
        id: new FormControl( '' ),
      }),

      project: new FormGroup({
        title: new FormControl( '' ),
        slug:  new FormControl( '' ),
      }),

      users: new FormGroup({
        ids: new FormArray([ ]),
      }),
    });
  }
}
