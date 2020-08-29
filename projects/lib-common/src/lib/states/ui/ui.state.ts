import { Injectable } from '@angular/core';
import { State, Store, Action, StateContext, Selector } from '@ngxs/store';
import { Ui } from './ui.action';
import { defaultNavigation } from './../../manifests';

export interface UiStateModel extends Ui { }

@State<UiStateModel>({
  name: 'ui',
  defaults: {
    navigation: [],
  },
  children: [
  ]
})
@Injectable()
export class UiState {

  @Selector()
  static navigation({ navigation }: UiStateModel) {
    return navigation;
  }
  
  constructor(
    private store: Store,
  ) { }

  @Action(Ui.LoadNavigation)
  loadNavigation(ctx: StateContext<UiStateModel>) {
    const navigation = defaultNavigation;
    ctx.patchState({ navigation });
  }

  @Action(Ui.ClearNavigation)
  clearNavigation(ctx: StateContext<UiStateModel>) {
    const navigation = [];
    ctx.patchState({ navigation });
  }
}
