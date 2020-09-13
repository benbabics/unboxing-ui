import { delay, tap } from 'rxjs/operators';
import { UpdateFormDirty } from '@ngxs/form-plugin';
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { ProjectSearch } from './project-search.action';
import { plainToFlattenObject } from '../../../../../../../../projects/lib-common/src/public-api';

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

  @Action( ProjectSearch.ResetFilters )
  resetFilters(ctx: StateContext<ProjectSearchStateModel>) {
    const action = new UpdateFormDirty({
      path:  "projectSearch.projectFiltersForm",
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
    return ctx.dispatch([
      new ProjectSearch.SetLoading( true ),
      new ProjectSearch.SetFilters( payload ),
    ])
    .pipe(
      delay( 1500 ),
      tap(() => ctx.dispatch( new ProjectSearch.SetLoading(false) )),
    );
  }
}
