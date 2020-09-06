import { UiNavigationItem, UiNavigationAppearance, UiThemeAppearance } from './ui.interfaces';

export interface Ui {
  navigationAppearance: UiNavigationAppearance;
  navigationItems: UiNavigationItem[],
  themeAppearance: UiThemeAppearance;
}

export namespace Ui {

  export class SetNavigationAppearance {
    static readonly type = '[Ui] SetNavigationAppearance';
    constructor( public navigationAppearance: UiNavigationAppearance ) { }
  }

  export class ToggleNavigationAppearance {
    static readonly type = '[Ui] ToggleNavigationAppearance';
  }
  
  export class LoadNavigationItems {
    static readonly type = '[Ui] LoadNavigationItems';
  }

  export class ClearNavigationItems {
    static readonly type = '[Ui] ClearNavigationItems';
  }

  export class SetThemeAppearance {
    static readonly type = '[Ui] SetThemeAppearance';
    constructor( public themeAppearance: UiThemeAppearance ) { }
  }
}
