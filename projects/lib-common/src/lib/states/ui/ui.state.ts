import { Injectable } from '@angular/core';
import { State, Store, Action, StateContext, Selector } from '@ngxs/store';
import { Ui } from './ui.action';
import { UiPreferencesState } from './ui-preferences';
import { defaultUiNavigation } from './../../manifests';

export interface UiStateModel extends Ui { }

@State<UiStateModel>({
  name: 'ui',
  defaults: {
    navigationItems: [],
  },
  children: [
    UiPreferencesState,
  ]
})
@Injectable()
export class UiState {

  @Selector()
  static navigationItems({ navigationItems }: UiStateModel) {
    return navigationItems;
  }

  @Action( Ui.LoadNavigationItems )
  loadNavigationItems(ctx: StateContext<UiStateModel>) {
    const navigationItems = defaultUiNavigation;
    ctx.patchState({ navigationItems });
  }

  @Action( Ui.ClearNavigationItems )
  clearNavigationItems(ctx: StateContext<UiStateModel>) {
    const navigationItems = [];
    ctx.patchState({ navigationItems });
  }
}
