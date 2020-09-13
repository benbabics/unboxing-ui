import {
  UiPreferencesNavigationAppearance,
  UiPreferencesThemeAppearance
} from './ui-preferences.interfaces';

export interface UiPreferences {
  navigationAppearance: UiPreferencesNavigationAppearance;
  themeAppearance: UiPreferencesThemeAppearance;
  projectIndexDrawerOpened: boolean;
}

export namespace UiPreferences {

  // navigationAppearance
  export class SetNavigationAppearance {
    static readonly type = '[UiPreferences] SetNavigationAppearance';
    constructor( public navigationAppearance: UiPreferencesNavigationAppearance ) { }
  }

  export class ToggleNavigationAppearance {
    static readonly type = '[UiPreferences] ToggleNavigationAppearance';
  }

  // themeAppearance
  export class SetThemeAppearance {
    static readonly type = '[UiPreferences] SetThemeAppearance';
    constructor( public themeAppearance: UiPreferencesThemeAppearance ) { }
  }

  // projectIndexDrawerOpened
  export class ToggleProjectIndexDrawerOpened {
    static readonly type = '[UiPreferences] ToggleProjectIndexDrawerOpened';
    constructor( public isOpened?: boolean ) { }
  }
}
