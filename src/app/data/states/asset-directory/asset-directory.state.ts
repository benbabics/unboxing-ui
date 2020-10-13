import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Action, StateContext, Store, Selector } from '@ngxs/store';
import { EntityStateModel, EntityState, defaultEntityState, IdStrategy, SetLoading, CreateOrReplace, Add, Update, Remove } from '@ngxs-labs/entity-state';
import { tap, finalize, flatMap } from 'rxjs/operators';
import { get, filter, find } from 'lodash';
import { AssetDirectory } from './asset-directory.action';

export interface AssetDirectoryStateModel extends EntityStateModel<AssetDirectory> { }

@State({
  name: 'assetDirectory',
  defaults: {
    ...defaultEntityState(),
    active: null
  }
})
@Injectable()
export class AssetDirectoryState extends EntityState<AssetDirectory> {

  @Selector([AssetDirectoryState.entities, AssetDirectoryState.activeId])
  static children(dirs: AssetDirectory[], parentId: string) {
    return filter(dirs, { parentId });
  }

  @Selector()
  static descendants(parentId: string) {
    return ({ assetDirectory }) => {
      const dirs: AssetDirectory[] = Object.values(assetDirectory.entities);
      return filter(dirs, { parentId });
    }
  }

  @Selector([AssetDirectoryState.entities])
  static ancestors(id: string) {
    return ({ assetDirectory }) => {
      const dirs: AssetDirectory[] = Object.values(assetDirectory.entities);
      return this.getAncestors(dirs, id).filter(dir => dir.id !== id);
    };
  }
  
  @Selector([AssetDirectoryState.entities])
  static allPaths(dirs: AssetDirectory[]) {
    const getPath = (id: string) => {
      const ancestors = this.getAncestors(dirs, id).map(dir => dir.name);
      return `/${ ancestors.join('/') }`;
    }

    return dirs.map(dir => <AssetDirectory>({ ...dir, path: getPath(dir.id) }));
  }
  
  constructor(
    private store: Store,
    private http: HttpClient,
  ) {
    super(AssetDirectoryState, 'id', IdStrategy.EntityIdGenerator);
  }

  @Action(AssetDirectory.Index)
  crudIndex(ctx: StateContext<AssetDirectoryStateModel>, { projectId }: AssetDirectory.Index) {
    this.toggleLoading(true);

    return this.http.get<AssetDirectory[]>(`/api/assetDirectories?projectId=${projectId}`)
      .pipe(
        tap(dirs => this.store.dispatch(new CreateOrReplace(AssetDirectoryState, dirs))),
        finalize(() => this.toggleLoading(false)),
      );
  }

  @Action(AssetDirectory.Create)
  crudCreate(ctx: StateContext<AssetDirectoryStateModel>, { payload }: AssetDirectory.Create) {
    this.toggleLoading(true);

    return this.http.post<AssetDirectory>(`/api/assetDirectories/`, payload)
      .pipe(
        flatMap(dir => this.store.dispatch(new Add(AssetDirectoryState, dir))),
        finalize(() => this.toggleLoading(false)),
      );
  }

  @Action(AssetDirectory.Update)
  crudUpdate(ctx: StateContext<AssetDirectoryStateModel>, { payload }: AssetDirectory.Update) {
    this.toggleLoading(true);

    return this.http.put<AssetDirectory>(`/api/assetDirectories/${payload.id}`, payload)
      .pipe(
        flatMap(dir => this.store.dispatch(new Update(AssetDirectoryState, dir.id, dir))),
        finalize(() => this.toggleLoading(false)),
      );
  }

  @Action(AssetDirectory.Destroy)
  crudDestroy(ctx: StateContext<AssetDirectoryStateModel>, { id }: AssetDirectory.Destroy) {
    this.toggleLoading(true);

    return this.http.delete(`/api/assetDirectories/${id}`)
      .pipe(
        flatMap(() => this.store.dispatch(new Remove(AssetDirectoryState, id))),
        finalize(() => this.toggleLoading(false)),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this.store.dispatch(new SetLoading(AssetDirectoryState, isLoading));
  }

  private static getAncestors(dirs: AssetDirectory[], id: string): AssetDirectory[] {
    let ancestors = filter(dirs, { id });
    
    do {
      id = get(find(dirs, { id }), 'parentId', null);
      id && ancestors.unshift(find(dirs, { id }));
    }
    while (id);
    
    return ancestors;
  }
}
