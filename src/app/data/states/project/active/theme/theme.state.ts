import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Action, Selector } from '@ngxs/store';
import { StateContext, Store } from '@ngxs/store';
import { defaultEntityState, EntityStateModel, EntityState, IdStrategy, Add, Update, SetLoading, SetActive, CreateOrReplace } from '@ngxs-labs/entity-state';
import { find, get } from 'lodash';
import { tap } from 'rxjs/operators';
import { Theme } from './theme.action';

export interface ThemeStateModel extends EntityStateModel<Theme> {
}

@State({
  name: 'theme',
  defaults: defaultEntityState()
})
@Injectable()
export class ThemeState extends EntityState<Theme> {

  @Selector()
  static findTemplate(templateId: string) {
    return state => {
      const theme = state.project.projectActive.theme.entitiesMap[ state.theme.active ];
      return find( theme.templates, [ 'id', templateId ] );
    }
  }

  @Selector([ ThemeState.active ])
  static templates(theme: Theme) {
    return get( theme, 'templates', [] );
  }

  constructor(
    private _store: Store,
    private _http: HttpClient,
  ) {
    super( ThemeState, 'slug', IdStrategy.EntityIdGenerator );
  }

  @Action( Theme.Index )
  crudIndex(ctx: StateContext<ThemeStateModel>) {
    this.toggleLoading( true );
    
    return this._http.get<Theme[]>( `/api/themes` )
      .pipe(
        tap(themes => this._store.dispatch( new CreateOrReplace(ThemeState, themes) )),
        tap(() => this.toggleLoading( false )),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this._store.dispatch( new SetLoading(ThemeState, isLoading) );
  }
}
