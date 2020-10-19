import { Injectable } from '@angular/core';
import { EntityActionType, ofEntityActionSuccessful } from '@ngxs-labs/entity-state';
import { Actions, Selector, State, StateContext, Store } from '@ngxs/store';
import { flatMap, tap } from 'rxjs/operators';
import { ProjectState } from '../project.state';
import { ProjectActive } from './active.action';
import { AssetDirectoryState } from './asset-directory';
import { AssetElementState } from './asset-element';
import { SlideState } from './slide';
import { ThemeState } from './theme';

export interface ProjectActiveStateModel extends ProjectActive {
  isLoading: boolean;
  manageProjectForm;
}

@State<ProjectActiveStateModel>({
  name: 'projectActive',
  defaults: {
    isLoading: false,
    project:   null,
    projectId: null,
    manageProjectForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    }
  },
  children: [
    AssetDirectoryState,
    AssetElementState,
    SlideState,
    ThemeState,
  ]
})
@Injectable()
export class ProjectActiveState {

  @Selector()
  static project(state: ProjectActiveStateModel) {
    return state.project;
  }
  
  @Selector()
  static projectId(state: ProjectActiveStateModel) {
    return state.projectId;
  }
  
  constructor(
    private _store: Store,
    private _actions$: Actions,
  ) { }

  ngxsOnInit(ctx: StateContext<ProjectActiveStateModel>) {
    this._actions$.pipe(
      ofEntityActionSuccessful( ProjectState, EntityActionType.SetActive ),
      flatMap(() => this._store.selectOnce( ProjectState.active )),
      tap(project => ctx.patchState({
        project,
        projectId: project.id
      })),
    )
    .subscribe();

    this._actions$.pipe(
      ofEntityActionSuccessful( ProjectState, EntityActionType.ClearActive ),
      tap(() => ctx.patchState({
        project:   null,
        projectId: null,
      })),
    )
    .subscribe();
  }
}