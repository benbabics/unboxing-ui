import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClearActive, CreateOrReplace, EntityActionType, ofEntityActionSuccessful, Reset, SetActive, UpdateActive } from '@ngxs-labs/entity-state';
import { Action, Actions, Selector, State, StateContext, Store } from '@ngxs/store';
import { chain, get, values } from 'lodash';
import { of } from 'rxjs';
import { delay, finalize, flatMap, tap } from 'rxjs/operators';
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
  static isLoading({ isLoading }: ProjectActiveStateModel): boolean {
    return isLoading;
  }
  
  @Selector()
  static project(state: ProjectActiveStateModel) {
    return state.project;
  }
  
  @Selector()
  static projectId(state: ProjectActiveStateModel) {
    return state.projectId;
  }

  @Selector([
    AssetDirectoryState.entities,
    AssetElementState.entities,
    SlideState.entities,
    ThemeState.activeId,
  ])
  static associations(assetDirectories, assetElements, slides, themeId) {
    return { assetDirectories, assetElements, slides, themeId };
  }
  
  constructor(
    private _store: Store,
    private _http: HttpClient,
    private _actions$: Actions,
  ) { }

  @Action( ProjectActive.SetLoading )
  setLoading(ctx: StateContext<ProjectActiveStateModel>, { isLoading }: ProjectActive.SetLoading) {
    ctx.patchState({ isLoading });
  }
  
  @Action( ProjectActive.SetAssociations )
  setAssociations(ctx: StateContext<ProjectActiveStateModel>, { payload }: ProjectActive.SetAssociations) {
    ctx.dispatch([
      new CreateOrReplace( AssetDirectoryState, payload.assetDirectories ),
      new CreateOrReplace( AssetElementState,   payload.assetElements ),
      new CreateOrReplace( SlideState,          payload.slides ),
      new SetActive( ThemeState, payload.themeId ),
      new SetActive( SlideState, get(payload, 'slides[0].id') ),
    ]);
  }

  @Action( ProjectActive.ClearAssociations )
  clearAssociations(ctx: StateContext<ProjectActiveStateModel>) {
    ctx.dispatch([
      new Reset( AssetDirectoryState ),
      new Reset( AssetElementState ),
      new Reset( SlideState ),
      new ClearActive( ThemeState ),
    ]);
  }

  @Action( ProjectActive.SaveAssociatedSlides )
  saveAssociatedSlides(ctx: StateContext<ProjectActiveStateModel>) {
    this.toggleLoading( true );

    const slides    = this._store.selectSnapshot( SlideState.entities );
    const projectId = this._store.selectSnapshot( ProjectActiveState.projectId );

    return this._http.patch( `/api/projects/${ projectId }`, { slides } )
      .pipe( finalize(() => this.toggleLoading( false )) );
  }

  @Action( ProjectActive.SetVisibilityStatus )
  setVisibilityStatus(ctx: StateContext<ProjectActiveStateModel>, { published }: ProjectActive.SetVisibilityStatus) {
    this.toggleLoading( true );

    const projectId = this._store.selectSnapshot( ProjectActiveState.projectId );

    return this._http.patch( `/api/projects/${ projectId }`, { published } )
      .pipe(
        tap(project => this._store.dispatch( new UpdateActive( ProjectState, project ))),
        finalize(() => this.toggleLoading( false )),
      );
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
      ofEntityActionSuccessful( ProjectState, EntityActionType.UpdateActive ),
      flatMap(() => this._store.selectOnce( ProjectState.active )),
      tap(project => ctx.patchState({
        project,
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

  private toggleLoading(isLoading: boolean): void {
    this._store.dispatch( new ProjectActive.SetLoading(isLoading) );
  }
}
