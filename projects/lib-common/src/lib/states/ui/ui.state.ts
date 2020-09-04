import { Injectable } from '@angular/core';
import { State, Store, Action, StateContext, Selector } from '@ngxs/store';
import { Ui } from './ui.action';
import { UiNavigationAppearance, UiThemeAppearance } from './ui.interfaces';
import { defaultUiNavigation } from './../../manifests';

export interface UiStateModel extends Ui { }

@State<UiStateModel>({
  name: 'ui',
  defaults: {
    navigationAppearance: UiNavigationAppearance.Dense,
    navigationItems: [],
    themeAppearance: UiThemeAppearance.Auto,
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

  @Selector()
  static themeAppearance({ themeAppearance }: UiStateModel) {
    return themeAppearance;
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
    const navigationItems = defaultUiNavigation;
    ctx.patchState({ navigationItems });
  }

  @Action( Ui.ClearNavigationItems )
  clearNavigationItems(ctx: StateContext<UiStateModel>) {
    const navigationItems = [];
    ctx.patchState({ navigationItems });
  }

  @Action( Ui.SetThemeAppearance )
  setThemeAppearance(ctx: StateContext<UiStateModel>, { themeAppearance }: Ui.SetThemeAppearance) {
    ctx.patchState({ themeAppearance });
  }
}
