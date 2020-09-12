import { UpdateFormDirty } from '@ngxs/form-plugin';
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { SearchProject } from './search-project.action';
import { plainToFlattenObject } from '../../../../../../../../projects/lib-common/src/public-api';

export interface SearchProjectStateModel extends SearchProject {
  projectFiltersForm,
}

@State<SearchProjectStateModel>({
  name: 'searchProject',
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
export class SearchProjectState {

  @Selector()
  static loading({ loading }: SearchProjectStateModel) {
    return loading;
  }

  @Selector()
  static filters({ filters }: SearchProjectStateModel) {
    return filters;
  }

  @Action( SearchProject.ResetFilters )
  resetFilters(ctx: StateContext<SearchProjectStateModel>) {
    const action = new UpdateFormDirty({
      path:  "searchProject.projectFiltersForm",
      dirty: false,
    });

    ctx.dispatch( action );
  }
  
  @Action( SearchProject.SetLoading )
  setLoading(ctx: StateContext<SearchProjectStateModel>, { loading }: SearchProject.SetLoading) {
    ctx.patchState({ loading });
  }

  @Action( SearchProject.SetFilters )
  setFilters(ctx: StateContext<SearchProjectStateModel>, { payload }: SearchProject.SetFilters) {
    const filters = plainToFlattenObject( payload ) || {};
    ctx.patchState({ filters });
  }

  @Action( SearchProject.Search )
  search(ctx: StateContext<SearchProjectStateModel>, { payload }: SearchProject.Search) {
    ctx.dispatch([
      new SearchProject.SetLoading( true ),
      new SearchProject.SetFilters( payload ),
    ]);
    setTimeout(() => ctx.dispatch( new SearchProject.SetLoading(false) ), 1500);
  }
}
