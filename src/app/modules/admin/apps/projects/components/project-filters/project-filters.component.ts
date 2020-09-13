import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { toPairs, set } from 'lodash';
import { Subject } from 'rxjs';
import { delay, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { ResetForm, UpdateFormValue } from '@ngxs/form-plugin';
import { SearchProject, SearchProjectState } from './../../states';

@Component({
  selector: 'project-filters',
  templateUrl: './project-filters.component.html',
  styleUrls: ['./project-filters.component.scss']
})
export class ProjectFiltersComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  
  readonly formPath = "searchProject.projectFiltersForm";
  projectFiltersForm: FormGroup;
  
  constructor(
    router: Router,
    actions$: Actions,
    private _store: Store,
    private _activatedRoute: ActivatedRoute,
  ) {
    this._buildForm();
    
    // on SearchProject.SetFilters, update the URL queryParams
    actions$.pipe(
      takeUntil( this._destroy$ ),
      ofActionSuccessful( SearchProject.SetFilters ),
      withLatestFrom( _store.select( SearchProjectState.filters )),
      map(([ payload, filters ]) => filters),
      map(queryParams => ({ queryParams, queryParamsHandling: '' })),
      tap(queryParams => router.navigate( [], <any>queryParams )),
    )
    .subscribe();
  }

  ngOnInit() {
    // on queryParam updates, update ngxs form state
    this._activatedRoute.queryParams.pipe(
      takeUntil( this._destroy$ ),
      map(params => toPairs( params )),
      map(pairs  => pairs.reduce((model, [k,v]) => set(model,k,v), {})),
      map(value  => this._store.dispatch( new ResetForm({ value, path: this.formPath }) )),
      delay( 1 ),
      tap(() => this.handleSubmit()),
    )
    .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  handleUpdateBrand(id: string): void {
    this._store.dispatch(new UpdateFormValue({
      propertyPath: 'brand',
      path:  this.formPath,
      value: { id: id || "" },
    }));
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
