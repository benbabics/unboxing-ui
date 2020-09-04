import { Injectable } from '@angular/core';
import { State, Store, Action, StateContext, Selector } from '@ngxs/store';
import { Ui, UiNavigationAppearance } from './ui.action';
import { defaultNavigation } from './../../manifests';

export interface UiStateModel extends Ui { }

@State<UiStateModel>({
  name: 'ui',
  defaults: {
    navigationAppearance: UiNavigationAppearance.Dense,
    navigationItems: [],
  },
  children: [
  ]
})
@Injectable()
export class UiState {

  @Selector()
  static navigationAppearance({ navigationAppearance }: UiStateModel) {
    return navigationAppearance;
  }
  
  @Selector()
  static navigationItems({ navigationItems }: UiStateModel) {
    return navigationItems;
  }
  
  constructor(
    private store: Store,
  ) { }

  @Action( Ui.SetNavigationAppearance )
  setNavigationAppearance(ctx: StateContext<UiStateModel>, { navigationAppearance }: Ui.SetNavigationAppearance) {
    ctx.patchState({ navigationAppearance });
  }

  @Action( Ui.ToggleNavigationAppearance )
  toggleNavigationAppearance(ctx: StateContext<UiStateModel>) {
    const Style = UiNavigationAppearance;
    const isClassic = ctx.getState().navigationAppearance === Style.Classic;
    const navigationAppearance = isClassic ? Style.Dense : Style.Classic;
    
    ctx.patchState({ navigationAppearance });
  }

  @Action( Ui.LoadNavigationItems )
  loadNavigationItems(ctx: StateContext<UiStateModel>) {
    const navigationItems = defaultNavigation;
    ctx.patchState({ navigationItems });
  }

  @Action( Ui.ClearNavigationItems )
  clearNavigationItems(ctx: StateContext<UiStateModel>) {
    const navigationItems = [];
    ctx.patchState({ navigationItems });
  }
}
