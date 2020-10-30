import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Settings } from './settings.action';
import { settingsNavigation } from '@libCommon';

export interface SettingsStateModel extends Settings {
  manageSettingsForm,
}

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    navigationItems: [],
    manageSettingsForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {}
    }
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
