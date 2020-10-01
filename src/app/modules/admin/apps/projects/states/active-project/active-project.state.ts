import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { ActiveProject } from "./active-project.action";
import { ActiveProjectInviteState } from "./invite";
import { ActiveProjectSearchState } from "./search";

export interface ActiveProjectStateModel extends ActiveProject {
}

@State<ActiveProjectStateModel>({
  name: 'activeProject',
  defaults: {
  },
  children: [
    ActiveProjectInviteState,
    ActiveProjectSearchState,
  ]
})
@Injectable()
export class ActiveProjectState {
}
