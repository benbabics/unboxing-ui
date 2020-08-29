import { UiNavigationItem } from './ui.interfaces';

export interface Ui {
  navigation: UiNavigationItem[],
}

export namespace Ui {
  
  export class LoadNavigation {
    static readonly type = '[Ui] LoadNavigation';
  }

  export class ClearNavigation {
    static readonly type = '[Ui] ClearNavigation';
  }
}
