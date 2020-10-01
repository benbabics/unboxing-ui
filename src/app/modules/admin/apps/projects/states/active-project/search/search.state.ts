import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { get, sortBy } from 'lodash';
import { finalize, flatMap, tap, map } from 'rxjs/operators';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { UpdateFormDirty } from '@ngxs/form-plugin';
import { ActiveProjectSearch } from './search.action';
import { CurrentMembershipState, plainToFlattenObject } from '../../../../../../../../../projects/lib-common/src/public-api';

export interface ActiveProjectSearchStateModel extends ActiveProjectSearch {
  projectFiltersForm,
}

@State<ActiveProjectSearchStateModel>({
  name: 'search',
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
export class ActiveProjectSearchState {

  @Selector()
  static loading({ loading }: ActiveProjectSearchStateModel) {
    return loading;
  }

  @Selector()
  static filters({ filters }: ActiveProjectSearchStateModel) {
    return filters;
  }

  @Selector()
  static results({ results }: ActiveProjectSearchStateModel) {
    return results;
  }

  constructor(
    private _store: Store,
    private _http: HttpClient,
  ) { }

  @Action( ActiveProjectSearch.ResetFilters )
  resetFilters(ctx: StateContext<ActiveProjectSearchStateModel>) {
    const action = new UpdateFormDirty({
      path:  "projectSearch.projectFiltersForm",
      dirty: false,
    });

    ctx.dispatch( action );
  }
  
  @Action( ActiveProjectSearch.SetLoading )
  setLoading(ctx: StateContext<ActiveProjectSearchStateModel>, { loading }: ActiveProjectSearch.SetLoading) {
    ctx.patchState({ loading });
  }

  @Action( ActiveProjectSearch.SetFilters )
  setFilters(ctx: StateContext<ActiveProjectSearchStateModel>, { payload }: ActiveProjectSearch.SetFilters) {
    const filters = plainToFlattenObject( payload ) || {};
    ctx.patchState({ filters });
  }

  @Action( ActiveProjectSearch.Search )
  search(ctx: StateContext<ActiveProjectSearchStateModel>, { payload }: ActiveProjectSearch.Search) {
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
      new ActiveProjectSearch.SetLoading( true ),
      new ActiveProjectSearch.SetFilters( payload ),
    ])
    .pipe(
      flatMap(() => this._store.selectOnce( CurrentMembershipState.accountId )),
      flatMap(id => this._http.get( `/api/accounts/${ id }/projects`, { params } )),
      map(results => sortBy( results, 'title' )),
      tap(results => ctx.patchState({ results })),
      finalize(() => ctx.dispatch( new ActiveProjectSearch.SetLoading(false) )),
    );
  }
}
