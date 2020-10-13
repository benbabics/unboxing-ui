import { UiNavigationItem } from 'app/data';

export interface Settings {
  navigationItems: UiNavigationItem[],
}

export namespace Settings {

  export class LoadNavigationItems {
    static readonly type = '[Settings] LoadNavigationItems';
  }

  export class ClearNavigationItems {
    static readonly type = '[Settings] ClearNavigationItems';
  }
}
