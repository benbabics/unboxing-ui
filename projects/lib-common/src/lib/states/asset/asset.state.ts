import { Injectable } from '@angular/core';
import { State, Store, Selector, Actions, Action, StateContext } from '@ngxs/store';
import { EntityStateModel, defaultEntityState, EntityState, IdStrategy, ofEntityActionSuccessful, EntityActionType } from '@ngxs-labs/entity-state';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, find, get, sortBy } from 'lodash';
import { Asset, FileElement, AssetFormat } from './asset.action';

export type AssetFileSystemType = Observable<{ [key in AssetFormat]: FileElement[] }>;

export interface AssetStateModel extends EntityStateModel<FileElement> {
  activeFile: string;
  filesystem: {
    ALL: FileElement[],
    PHOTO: FileElement[],
    VIDEO: FileElement[],
  };
}

@State({
  name: 'asset',
  defaults: {
    ...defaultEntityState(),
    filesystem: {
      ALL: [],
      PHOTO: [],
      VIDEO: [],
    },
  }
})
@Injectable()
export class AssetState extends EntityState<Asset> {
  
  @Selector()
  static activeFileId({ activeFile }: AssetStateModel) {
    return activeFile;
  }
  
  @Selector()
  static activeFile({ activeFile, filesystem }: AssetStateModel) {
    return find(filesystem[AssetFormat.All], { id: activeFile });
  }

  @Selector()
  static activeFileDirectDescendants({ activeFile, filesystem }: AssetStateModel) {
    return Object.keys(filesystem).reduce((model, id) => ({
      ...model,
      [id]: filter(filesystem[id], { parentId: activeFile })
    }), {});
  }

  @Selector()
  static activeFileAllDescendants({ activeFile, filesystem }: AssetStateModel) {
    return Object.keys(filesystem).reduce((model, id) => ({
      ...model,
      [id]: filter(filesystem[id], { isFolder: false })
    }), {});
  }
  
  @Selector()
  static selectedIds(state: AssetStateModel) {
    let id = state.active;
    let ids = id ? [id] : [];

    do {
      id = get(find(state.entities, { id }), 'parentId', null);
      id && ids.push(id);
    }
    while (id);

    return ids;
  }

  @Selector()
  static childrenAll(parentId: string, filterFn?: (el: FileElement) => boolean) {
    return ({ asset }: any) => {
      const entities: any[] = Object.values(asset.entities);

      const reducer = (collection: Set<Asset>, id: string) => {
        const children = entities.filter(
          el => el.parentId === id && (filterFn ? filterFn(el) : true)
        );
        filter(children, { isFolder: true }).forEach(child  => reducer(collection, child.id));
        filter(children, { isFolder: false }).forEach(child => collection.add(child));
      }

      const collection: Set<Asset> = new Set();
      reducer(collection, parentId);

      return sortBy([ ...collection.values() ], ['name']);
    }
  }

  @Selector()
  static children(parentId: string, format: AssetFormat = AssetFormat.All) {
    return ({ asset }: any) => {
      return filter(asset.filesystem[format], { parentId });
    }
  }
  
  constructor(
    private store: Store,
    private http: HttpClient,
    actions$: Actions,
  ) {
    super(AssetState, 'id', IdStrategy.EntityIdGenerator);

    actions$.pipe(ofEntityActionSuccessful(AssetState, EntityActionType.CreateOrReplace))
      .subscribe(({ payload }) => store.dispatch(new Asset.TransformAsFiles(payload)));
  }

  private transformer(asset: Partial<Asset>): FileElement {
    const id       = asset.path;
    const keys     = id.split('/');
    const name     = keys.pop();
    const parentId = keys.join('/') || null;
    const isFolder = !get(asset, 'format');
    const assetId  = asset.id;

    return { id, name, isFolder, parentId, assetId };
  }

  @Action(Asset.ClearActiveFile)
  clearActiveFile(ctx: StateContext<AssetStateModel>) {
    ctx.patchState({ activeFile: null });
  }

  @Action(Asset.SetActiveFile)
  setActiveFile(ctx: StateContext<AssetStateModel>, { id }: Asset.SetActiveFile) {
    ctx.patchState({ activeFile: id });
  }

  @Action(Asset.TransformAsFiles)
  transformAsFiles(ctx: StateContext<AssetStateModel>, { payload }: Asset.TransformAsFiles) {
    const ALL   = new Map();
    const PHOTO = new Map();
    const VIDEO = new Map();

    const transform = (map, asset: Partial<Asset>) => {
      const file = this.transformer(asset);
      const path = file.parentId;

      if (path && !map.has(path)) 
        transform(map, { path: path });

      map.set(file.id, file);
    };

    const assets = [
      ...Object.values(ctx.getState().entities),
      ...payload
    ];

    assets
      .forEach(asset => transform(ALL, asset));
      
    filter(assets, { format: AssetFormat.Photo })
      .forEach(asset => transform(PHOTO, asset));

    filter(assets, { format: AssetFormat.Video })
      .forEach(asset => transform(VIDEO, asset));

    const filesystem = {
      ALL:   sortBy([ ...ALL.values() ], ['name']),
      PHOTO: sortBy([ ...PHOTO.values() ], ['name']),
      VIDEO: sortBy([ ...VIDEO.values() ], ['name']),
    };
    
    ctx.patchState({ filesystem });
  }
}
