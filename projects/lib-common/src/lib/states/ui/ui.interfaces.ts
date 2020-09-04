import { TreoNavigationItem } from '@treo/components/navigation';

export interface UiNavigationItem extends TreoNavigationItem {}

export type UiNavigationAppearance = keyof {
  "classic", "dense"
}
export namespace UiNavigationAppearance {
  export const Classic: UiNavigationAppearance = "classic";
  export const Dense: UiNavigationAppearance = "dense";
}

export type UiThemeAppearance = keyof {
  "auto", "dark", "light"
}
export namespace UiThemeAppearance {
  export const Auto: UiThemeAppearance = "auto";
  export const Dark: UiThemeAppearance = "dark";
  export const Light: UiThemeAppearance = "light";
}
