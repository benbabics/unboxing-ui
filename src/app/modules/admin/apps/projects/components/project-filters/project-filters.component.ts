import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { toPairs, set } from 'lodash';
import { Subject } from 'rxjs';
import { delay, map, takeUntil, tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { ResetForm, UpdateFormValue } from '@ngxs/form-plugin';

@Component({
  selector: 'project-filters',
  templateUrl: './project-filters.component.html',
  styleUrls: ['./project-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectFiltersComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  
  projectFiltersForm: FormGroup;
  readonly formPath = "project.search.projectFiltersForm";

  @Output() onFilterUpdate = new EventEmitter();
  
  constructor(
    private _store: Store,
    private _activatedRoute: ActivatedRoute,
  ) {
    this._buildForm();
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
      value: { id },
    }));
  }

  handleSubmit(): void {
    const filters = this.projectFiltersForm.getRawValue();
    this.onFilterUpdate.emit( filters );
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
