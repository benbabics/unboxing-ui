import { State, Action, Selector } from '@ngxs/store';
import { StateContext, Store } from '@ngxs/store';
import { defaultEntityState, EntityStateModel, EntityState, IdStrategy, Add, Update, SetLoading, SetActive, CreateOrReplace } from '@ngxs-labs/entity-state';
import { HttpClient } from '@angular/common/http';
import { find, get } from 'lodash';
import { tap } from 'rxjs/operators';
import { Theme } from './theme.action';

export interface ThemeStateModel extends EntityStateModel<Theme> {
}

@State({
  name: 'theme',
  defaults: defaultEntityState()
})
export class ThemeState extends EntityState<Theme> {

  @Selector()
  static findTemplate(templateId: string) {
    return state => {
      const theme = find(state.theme.entities, ['id', state.theme.active]);
      return find(theme.templates, ['id', templateId]);
    }
  }

  @Selector([ThemeState.active])
  static templates(theme: Theme) {
    return get(theme, 'templates', []);
  }

  constructor(
    private store: Store,
    private http: HttpClient,
  ) {
    super(ThemeState, 'id', IdStrategy.EntityIdGenerator);
  }

  @Action(Theme.Index)
  crudIndex(ctx: StateContext<ThemeStateModel>) {
    this.toggleLoading(true);

    return this.http.get<Theme[]>(`/api/themes`)
      .pipe(
        tap(themes => this.store.dispatch(new CreateOrReplace(ThemeState, themes))),
        tap(() => this.toggleLoading(false)),
      );
  }

  @Action(Theme.Show)
  crudShow(ctx: StateContext<ThemeStateModel>, { id }: Theme.Show) {
    this.toggleLoading(true);

    return this.http.get<Theme>(`/api/themes/${id}`)
      .pipe(
        tap(theme => this.store.dispatch([
          new CreateOrReplace(ThemeState, theme),
          new SetActive(ThemeState, `${id}`),
        ])),
        tap(() => this.toggleLoading(false)),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this.store.dispatch(new SetLoading(ThemeState, isLoading));
  }
}
