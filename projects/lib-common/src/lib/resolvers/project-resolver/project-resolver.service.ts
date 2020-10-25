import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { CreateOrReplace } from '@ngxs-labs/entity-state';
import { AccountState, BrandState, ProjectState, SlideState, AssetDirectoryState, AssetElementState, AssetState, Project } from '../../states';

@Injectable({
  providedIn: 'root'
})
export class ProjectResolverAbstractService {

  constructor(
    protected store: Store,
  ) { }

  buildAssociations(): Observable<any> {
    const project:Project = this.store.selectSnapshot(ProjectState.active);

    return this.store.dispatch([
      new CreateOrReplace(AccountState, project.account),
      new CreateOrReplace(BrandState, project.brand),
      new CreateOrReplace(SlideState, project.slides),
      new CreateOrReplace(AssetDirectoryState, project.assetDirectories),
      new CreateOrReplace(AssetElementState, project.assetElements),

      new CreateOrReplace(AssetState, project.assets || []),
    ])
      .pipe(map(() => project));
  }
}
