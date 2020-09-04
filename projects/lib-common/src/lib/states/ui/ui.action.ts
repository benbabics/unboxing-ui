import { UiNavigationItem } from './ui.interfaces';

export type UiNavigationAppearance = keyof {
  "classic", "dense"
}
export namespace UiNavigationAppearance {
  export const Classic: UiNavigationAppearance = "classic";
  export const Dense: UiNavigationAppearance = "dense";
}

export interface Ui {
  navigationAppearance: UiNavigationAppearance;
  navigationItems: UiNavigationItem[],
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
}
