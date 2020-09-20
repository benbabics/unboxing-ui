import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Action, Selector } from '@ngxs/store';
import { StateContext, Store } from '@ngxs/store';
import { defaultEntityState, EntityStateModel, EntityState, IdStrategy, Add, Update, SetLoading, SetActive, CreateOrReplace } from '@ngxs-labs/entity-state';
import { UpdateFormValue, UpdateFormErrors, UpdateFormStatus } from '@ngxs/form-plugin';
import { filter as rxFilter, finalize, flatMap, map, tap, delay } from 'rxjs/operators';
import { assign, filter, first, get, pick, sortBy } from 'lodash';
import { AccountState } from '../account/account.state';
import { BrandState } from '../brand/brand.state';
import { Project } from './project.action';

export interface ProjectStateModel extends EntityStateModel<Project> {
  manageProjectForm,
}

@State({
  name: 'project',
  defaults: {
    ...defaultEntityState(),
    manageProjectForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    }
  }
})
@Injectable()
export class ProjectState extends EntityState<Project> {

  get associations(): { accountId: string, brandId: string } {
    const getId = selector =>
      get(this.store.selectSnapshot(selector), 'id');

    return {
      accountId: getId(AccountState.active),
      brandId:   getId(BrandState.active),
    };
  }
  
  @Selector()
  static sortedEntities(state: ProjectStateModel) {
    return sortBy(state.entities, ['title']);
  }

  @Selector([ProjectState.sortedEntities, BrandState.activeId])
  static filteredEntities(entities: Project[], brandId: string) {
    return filter(entities, { brandId });
  }
  
  constructor(
    private store: Store,
    private http: HttpClient,
  ) {
    super(ProjectState, 'id', IdStrategy.EntityIdGenerator);
  }

  @Action(Project.Manage)
  open(ctx: StateContext<ProjectStateModel>, action: Project.Manage) {
    this.store.dispatch(new UpdateFormValue({
      path: 'project.manageProjectForm',
      value: action.payload,
    }));
  }

  @Action(Project.Show)
  crudShow(ctx: StateContext<ProjectStateModel>, { slug }: Project.Show) {
    this.toggleLoading(true);

    const paramsMap = new Map();
    paramsMap.set('slug',   [ slug ]);
    paramsMap.set('_expand', [ 'account', 'brand' ]);
    paramsMap.set('_embed',  [ 'slides', 'assetDirectories', 'assetElements' ]);

    const query = [ ...paramsMap.entries() ]
      .map(([key, resources]) => resources.map(resource => `${key}=${resource}`))
      .reduce((resources, resource) => [...resources, ...resource])
      .join('&');
    
    // temp until real api to return single Project, scoped by slug
    return this.http.get(`/api/projects/?${query}`)
      .pipe(
        map((projects: Project[]) => first(projects)),
        rxFilter(project => !!project),
        tap(project => this.store.dispatch(new CreateOrReplace(ProjectState, project))),
        tap(project => this.store.dispatch(new SetActive(ProjectState, project.id))),
        tap(() => this.toggleLoading(false)),
      );
  }

  @Action( Project.Create )
  crudCreate(ctx: StateContext<ProjectStateModel>, { payload }: Project.Create) {
    this.toggleLoading( true );

    return this.http.post<Project>( `/api/accounts/${ payload.accountId }/projects`, payload )
      .pipe(
        flatMap(project => ctx.dispatch( new Add(ProjectState, project) )),
        finalize(() => this.toggleLoading( false )),
      );
  }

  @Action(Project.Update)
  crudUpdate(ctx: StateContext<ProjectStateModel>, { payload }: Project.Update) {
    this.toggleLoading(true);

    let model = pick(payload, 'id', 'slug', 'title', 'accountId', 'brandId', 'themeId');
    assign(model, this.associations);

    return this.http.put<Project>(`/api/projects/${payload.id}`, model)
      .pipe(
        flatMap(proj => this.store.dispatch(new Update(ProjectState, proj.id, proj))),
        finalize(() => this.toggleLoading(false)),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this.store.dispatch(new SetLoading(ProjectState, isLoading));
  }
}
