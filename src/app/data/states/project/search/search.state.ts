import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forEach, get, isObject, sortBy } from 'lodash';
import { finalize, flatMap, tap, map } from 'rxjs/operators';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { UpdateFormDirty } from '@ngxs/form-plugin';
import { ProjectSearch } from './search.action';
import { CurrentMembershipState } from '../../app';

function plainToFlattenObject(object) {
  const result = {};

  function flatten(obj, prefix = "") {
    forEach(obj, (value, key) => {
      if ( !value ) return;

      if ( isObject(value) ) {
        flatten( value, `${ prefix }${ key }.` );
      } 
      else {
        result[ `${ prefix }${ key }` ] = value;
      }
    })
  }

  flatten( object );
  return result;
}

export interface ProjectSearchStateModel extends ProjectSearch {
  projectFiltersForm,
}

@State<ProjectSearchStateModel>({
  name: 'projectSearch',
  defaults: {
    loading: false,
    filters: {},
    results: [],

    projectFiltersForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {}
    }
  }
})
@Injectable()
export class ProjectSearchState {

  @Selector()
  static loading({ loading }: ProjectSearchStateModel) {
    return loading;
  }

  @Selector()
  static filters({ filters }: ProjectSearchStateModel) {
    return filters;
  }

  @Selector()
  static results({ results }: ProjectSearchStateModel) {
    return results;
  }

  constructor(
    private _store: Store,
    private _http: HttpClient,
  ) { }

  @Action( ProjectSearch.ResetFilters )
  resetFilters(ctx: StateContext<ProjectSearchStateModel>) {
    const action = new UpdateFormDirty({
      path:  "project.projectSearch.projectFiltersForm",
      dirty: false,
    });

    ctx.dispatch( action );
  }
  
  @Action( ProjectSearch.SetLoading )
  setLoading(ctx: StateContext<ProjectSearchStateModel>, { loading }: ProjectSearch.SetLoading) {
    ctx.patchState({ loading });
  }

  @Action( ProjectSearch.SetFilters )
  setFilters(ctx: StateContext<ProjectSearchStateModel>, { payload }: ProjectSearch.SetFilters) {
    const filters = plainToFlattenObject( payload ) || {};
    ctx.patchState({ filters });
  }

  @Action( ProjectSearch.Search )
  search(ctx: StateContext<ProjectSearchStateModel>, { payload }: ProjectSearch.Search) {
    let params = new HttpParams();
    [
      [ 'brandId',    get( payload, 'brand.id' ) ],
      [ 'slug_like',  get( payload, 'project.slug' ) ],
      [ 'title_like', get( payload, 'project.title' ) ],
    ]
    .forEach(([ key, value ]) => {
      if ( value ) params = params.append( key, value );
    });

    return ctx.dispatch([
      new ProjectSearch.SetLoading( true ),
      new ProjectSearch.SetFilters( payload ),
    ])
    .pipe(
      flatMap(() => this._store.selectOnce( CurrentMembershipState.accountId )),
      flatMap(id => this._http.get( `/api/accounts/${ id }/projects`, { params } )),
      map(results => sortBy( results, 'title' )),
      tap(results => ctx.patchState({ results })),
      finalize(() => ctx.dispatch( new ProjectSearch.SetLoading(false) )),
    );
  }
}
