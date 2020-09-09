import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { SetActive } from '@ngxs-labs/entity-state';
import { Brand, BrandState, Project, ProjectState } from '../../../../../../../../projects/lib-common/src/public-api';
import { TreoMediaWatcherService } from '@treo/services/media-watcher/media-watcher.service';

@Component({
  selector: 'project-index',
  templateUrl: './project-index.component.html',
  styleUrls: ['./project-index.component.scss'],
})
export class ProjectIndexComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();

  drawerMode: 'over' | 'side';
  drawerOpened: boolean;
  projectForm: FormGroup;
  
  @ViewChild('drawer') drawer: MatDrawer;

  @Select( BrandState.active ) activeBrand$: Observable<Brand>;
  @Select( ProjectState.entities ) projects$: Observable<Project[]>;

  get activeProjects(): Project[] {
    return this._store.selectSnapshot( ProjectState.filteredEntities );
  }
  
  constructor(
    private _store: Store,
    private _treoMediaWatcherService: TreoMediaWatcherService,
  ) {
    this.drawerMode   = 'side';
    this.drawerOpened = false;
  }

  ngOnInit(): void {
    this._treoMediaWatcherService.onMediaChange$
      .pipe( takeUntil(this._destroy$) )
      .subscribe(({ matchingAliases }) => {
        if ( matchingAliases.includes('lt-lg') ) {
          this.drawerMode   = 'over';
          this.drawerOpened = false;
        }
        else {
          this.drawerMode = 'side';
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  handleBrandUpdate(brand: Brand): void {
    if ( brand ) {
      this._store.dispatch( new SetActive(BrandState, brand.id) );
    }
  }
}
