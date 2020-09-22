export type UiPreferencesNavigationAppearance = keyof {
  "classic", "dense"
}
export namespace UiPreferencesNavigationAppearance {
  export const Classic: UiPreferencesNavigationAppearance = "classic";
  export const Dense: UiPreferencesNavigationAppearance = "dense";
}

export type UiPreferencesThemeAppearance = keyof {
  "auto", "dark", "light"
}
export namespace UiPreferencesThemeAppearance {
  export const Auto: UiPreferencesThemeAppearance = "auto";
  export const Dark: UiPreferencesThemeAppearance = "dark";
  export const Light: UiPreferencesThemeAppearance = "light";
}
