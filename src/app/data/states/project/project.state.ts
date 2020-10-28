import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { defaultEntityState, EntityStateModel, EntityState, IdStrategy, Add, Update, SetLoading, CreateOrReplace, Reset } from '@ngxs-labs/entity-state';
import { sortBy } from 'lodash';
import { filter, finalize, flatMap, tap } from 'rxjs/operators';
import { BrandState } from '../brand/brand.state';
import { Project } from './project.action';
import { AssetDirectoryState, AssetElementState, ProjectActive, ProjectActiveState, SlideState } from './active';
import { ProjectSearchState } from './search';
import { ProjectMemberState } from './member';

export interface ProjectStateModel extends EntityStateModel<Project> {
}

@State({
  name: 'project',
  defaults: {
    ...defaultEntityState(),
  },
  children: [
    ProjectActiveState,
    ProjectMemberState,
    ProjectSearchState,
  ]
})
@Injectable()
export class ProjectState extends EntityState<Project> {

  @Selector()
  static sortedEntities(state: ProjectStateModel) {
    return sortBy( state.entities, [ 'title' ] );
  }

  @Selector([ ProjectState.sortedEntities, BrandState.activeId ])
  static filteredEntities(entities: Project[], activeBrandId: string) {
    return entities.filter(({ brandId }) => brandId === activeBrandId );
  }
  
  constructor(
    private _store: Store,
    private _http: HttpClient,
  ) {
    super( ProjectState, "id", IdStrategy.EntityIdGenerator );
  }

  @Action( Project.Create )
  crudCreate(ctx: StateContext<ProjectStateModel>, { payload }: Project.Create) {
    this.toggleLoading( true );

    return this._http.post<Project>( `/api/accounts/${ payload.accountId }/projects`, payload )
      .pipe(
        flatMap(project => ctx.dispatch( new Add(ProjectState, project) )),
        finalize(() => this.toggleLoading( false )),
      );
  }
  
  @Action( Project.Show )
  crudShow(ctx: StateContext<ProjectStateModel>, { id }: Project.Show) {
    this.toggleLoading( true );

    return this._http.get<Project>( `/api/projects/${ id }` )
      .pipe(
        filter(project => !!project),
        tap(({ brand, assetDirectories, assetElements, slides, ...project }: any ) => {
          return ctx.dispatch([
            new CreateOrReplace( ProjectState, project ),
            new ProjectActive.SetAssociations({
              themeId: project.themeId,
              assetDirectories,
              assetElements,
              slides,
            }),
          ])
        }),
        tap(() => this.toggleLoading( false )),
      );
  }

  @Action( Project.Update )
  crudUpdate(ctx: StateContext<ProjectStateModel>, { payload }: Project.Update) {
    this.toggleLoading( true );

    return this._http.patch<Project>( `/api/projects/${ payload.id }`, payload )
      .pipe(
        flatMap(project => ctx.dispatch([
          new Update( ProjectState, project.id, project ),
        ])),
        finalize(() => this.toggleLoading( false )),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this._store.dispatch( new SetLoading(ProjectState, isLoading) );
  }
}
