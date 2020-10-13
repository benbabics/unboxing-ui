import { UiNavigationItem } from './ui.interfaces';

export interface Ui {
  navigationItems: UiNavigationItem[],
}

export namespace Ui {

  export class LoadNavigationItems {
    static readonly type = '[Ui] LoadNavigationItems';
  }

  export class ClearNavigationItems {
    static readonly type = '[Ui] ClearNavigationItems';
  }
}
