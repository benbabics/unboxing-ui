import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Settings } from './settings.action';
import { settingsNavigation } from './../../../../../../../projects/lib-common/src/public-api';

export interface SettingsStateModel extends Settings { }

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    navigationItems: [],
  },
})
@Injectable()
export class SettingsState {

  @Selector()
  static navigationItems({ navigationItems }: SettingsStateModel) {
    return navigationItems;
  }

  @Action( Settings.LoadNavigationItems )
  loadNavigationItems(ctx: StateContext<SettingsStateModel>) {
    const navigationItems = settingsNavigation;
    ctx.patchState({ navigationItems });
  }

  @Action( Settings.ClearNavigationItems )
  clearNavigationItems(ctx: StateContext<SettingsStateModel>) {
    const navigationItems = [];
    ctx.patchState({ navigationItems });
  }
}
