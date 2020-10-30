import { Injectable } from '@angular/core';
import { isNil } from 'lodash';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { UiPreferences } from './ui-preferences.action';
import { UiPreferencesNavigationAppearance, UiPreferencesThemeAppearance } from './ui-preferences.interfaces';

export interface UiPreferencesStateModel extends UiPreferences { }

@State<UiPreferencesStateModel>({
  name: 'preferences',
  defaults: {
    navigationAppearance: UiPreferencesNavigationAppearance.Dense,
    themeAppearance:      UiPreferencesThemeAppearance.Auto,
    projectIndexDrawerOpened: false,
  }
})
@Injectable()
export class UiPreferencesState {

  @Selector()
  static navigationAppearance({ navigationAppearance }: UiPreferencesStateModel) {
    return navigationAppearance;
  }

  @Selector()
  static themeAppearance({ themeAppearance }: UiPreferencesStateModel) {
    return themeAppearance;
  }

  @Selector()
  static projectIndexDrawerOpened({ projectIndexDrawerOpened }: UiPreferencesStateModel) {
    return projectIndexDrawerOpened;
  }

  @Action( UiPreferences.SetNavigationAppearance )
  setNavigationAppearance(ctx: StateContext<UiPreferencesStateModel>, { navigationAppearance }: UiPreferences.SetNavigationAppearance) {
    ctx.patchState({ navigationAppearance });
  }

  @Action( UiPreferences.ToggleNavigationAppearance )
  toggleNavigationAppearance(ctx: StateContext<UiPreferencesStateModel>) {
    const Style = UiPreferencesNavigationAppearance;
    const isClassic = ctx.getState().navigationAppearance === Style.Classic;
    const navigationAppearance = isClassic ? Style.Dense : Style.Classic;
    
    ctx.patchState({ navigationAppearance });
  }

  @Action( UiPreferences.SetThemeAppearance )
  setThemeAppearance(ctx: StateContext<UiPreferencesStateModel>, { themeAppearance }: UiPreferences.SetThemeAppearance) {
    ctx.patchState({ themeAppearance });
  }

  @Action( UiPreferences.ToggleProjectIndexDrawerOpened )
  toggleProjectIndexDrawerOpened(ctx: StateContext<UiPreferencesStateModel>, { isOpened }: UiPreferences.ToggleProjectIndexDrawerOpened) {
    const currentValue = ctx.getState().projectIndexDrawerOpened;
    ctx.patchState({
      projectIndexDrawerOpened: isNil( isOpened ) ? !currentValue : isOpened 
    });
  }
}
