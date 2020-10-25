import { Injectable } from '@angular/core';
import { ClearActive, CreateOrReplace, EntityActionType, ofEntityActionSuccessful, Reset, SetActive } from '@ngxs-labs/entity-state';
import { Action, Actions, Selector, State, StateContext, Store } from '@ngxs/store';
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

  @Action( ProjectActive.SetAssociations )
  setAssociations(ctx: StateContext<ProjectActiveStateModel>, { payload }: ProjectActive.SetAssociations) {
    ctx.dispatch([
      new SetActive( ThemeState, payload.themeId ),
      new CreateOrReplace( AssetDirectoryState, payload.assetDirectories ),
      new CreateOrReplace( AssetElementState,   payload.assetElements ),
      new CreateOrReplace( SlideState,          payload.slides ),
    ]);
  }

  @Action( ProjectActive.ClearAssociations )
  clearAssociations(ctx: StateContext<ProjectActiveStateModel>) {
    ctx.dispatch([
      new ClearActive( ThemeState ),
      new Reset( AssetDirectoryState ),
      new Reset( AssetElementState ),
      new Reset( SlideState ),
    ]);
  }

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
