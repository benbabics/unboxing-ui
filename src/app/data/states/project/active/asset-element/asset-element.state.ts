import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Action, StateContext, Store, Selector } from '@ngxs/store';
import { EntityStateModel, EntityState, defaultEntityState, IdStrategy, SetLoading, CreateOrReplace, Add, Update, Remove } from '@ngxs-labs/entity-state';
import { tap, finalize, flatMap } from 'rxjs/operators';
import { filter, sortBy } from 'lodash';
import { AssetDirectory } from './../asset-directory/asset-directory.action';
import { AssetElement, AssetElementFormat } from './asset-element.action';
import { AssetDirectoryState } from './../asset-directory/asset-directory.state';

export interface AssetElementStateModel extends EntityStateModel<AssetElement> { }

@State({
  name: 'assetElement',
  defaults: {
    ...defaultEntityState()
  }
})
@Injectable()
export class AssetElementState extends EntityState<AssetElement> {

  @Selector([AssetElementState.entities, AssetDirectoryState.activeId])
  static children(assetElements: AssetElement[], assetDirectoryId: string) {
    return filter(assetElements, { assetDirectoryId });
  }

  @Selector()
  static descendants(assetDirectoryId: string, format: AssetElementFormat = AssetElementFormat.All) {
    return ({ assetElement }) => {
      const formats  = [AssetElementFormat.Photo, AssetElementFormat.Video];
      const entities: AssetElement[] = Object.values(assetElement.entities);
      const elements = filter(entities, { assetDirectoryId });
      
      if (formats.includes(format)) {
        return filter(elements, { format });
      }

      return elements;
    }
  }

  @Selector()
  static allDescendants(directoryId: string) {
    return ({ assetElement, assetDirectory }) => {
      const els: AssetElement[]    = Object.values(assetElement.entities);
      const dirs: AssetDirectory[] = Object.values(assetDirectory.entities);
      
      const reducer = (collection: Set<AssetElement>, id: string) => {
        filter(dirs, { parentId: id }).forEach(dir => reducer(collection, dir.id));
        filter(els, { assetDirectoryId: id }).forEach(el => collection.add(el));
      }

      const collection: Set<AssetElement> = new Set();
      reducer(collection, directoryId);

      return sortBy([...collection.values()], ['name']);
    }
  }
  
  constructor(
    private store: Store,
    private http: HttpClient,
  ) {
    super(AssetElementState, 'id', IdStrategy.EntityIdGenerator);
  }

  @Action(AssetElement.Index)
  crudIndex(ctx: StateContext<AssetElementStateModel>, { projectId }: AssetElement.Index) {
    this.toggleLoading(true);

    return this.http.get<AssetElement[]>(`/api/assetElements?projectId=${projectId}`)
      .pipe(
        tap(els => this.store.dispatch(new CreateOrReplace(AssetElementState, els))),
        finalize(() => this.toggleLoading(false)),
      );
  }

  @Action(AssetElement.Create)
  crudCreate(ctx: StateContext<AssetElementStateModel>, { payload }: AssetElement.Create) {
    this.toggleLoading(true);

    return this.http.post<AssetElement>(`/api/assetElements/${payload.id}`, payload)
      .pipe(
        flatMap(el => this.store.dispatch(new Add(AssetElementState, el))),
        finalize(() => this.toggleLoading(false)),
      );
  }

  @Action(AssetElement.Update)
  crudUpdate(ctx: StateContext<AssetElementStateModel>, { payload }: AssetElement.Update) {
    this.toggleLoading(true);

    return this.http.put<AssetElement>(`/api/assetElements/${payload.id}`, payload)
      .pipe(
        flatMap(el => this.store.dispatch(new Update(AssetElementState, el.id, el))),
        finalize(() => this.toggleLoading(false)),
      );
  }

  @Action(AssetElement.Destroy)
  crudDestroy(ctx: StateContext<AssetElementStateModel>, { id }: AssetElement.Destroy) {
    this.toggleLoading(true);

    return this.http.delete(`/api/assetElements/${id}`)
      .pipe(
        flatMap(() => this.store.dispatch(new Remove(AssetElementState, id))),
        finalize(() => this.toggleLoading(false)),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this.store.dispatch(new SetLoading(AssetElementState, isLoading));
  }
}
