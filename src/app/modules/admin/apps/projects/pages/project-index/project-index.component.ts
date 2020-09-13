import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { toPairs, omit } from 'lodash';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Select, Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { TreoMediaWatcherService } from '@treo/services/media-watcher/media-watcher.service';
import { SearchProject, SearchProjectState } from '../../states';
import { Brand, BrandState, Project, ProjectState, UiPreferencesState, UiPreferences } from '../../../../../../../../projects/lib-common/src/public-api';

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

  filters$: Observable<any>;
  
  @ViewChild('drawer') drawer: MatDrawer;

  @Select( BrandState.active ) activeBrand$: Observable<Brand>;
  @Select( ProjectState.entities ) projects$: Observable<Project[]>;
  @Select( SearchProjectState.loading ) loading$: Observable<boolean>;
  @Select( UiPreferencesState.projectIndexDrawerOpened) drawerOpened$: Observable<boolean>;

  get activeProjects(): Project[] {
    return this._store.selectSnapshot( ProjectState.filteredEntities );
  }
  
  constructor(
    actions$: Actions,
    private _store: Store,
    private _router: Router,
    private _treoMediaWatcherService: TreoMediaWatcherService,
  ) {
    this.drawerMode = 'side';

    // on SearchProject.SetFilters, update the URL queryParams
    actions$.pipe(
      takeUntil( this._destroy$ ),
      ofActionSuccessful( SearchProject.SetFilters ),
      withLatestFrom( _store.select(SearchProjectState.filters) ),
      map(([ payload, filters ]) => filters),
      tap(filters => this.updateUrlQueryParams( filters )),
    )
    .subscribe();
  }

  ngOnInit(): void {
    this._treoMediaWatcherService.onMediaChange$
      .pipe( takeUntil(this._destroy$) )
      .subscribe(({ matchingAliases }) => {
        if ( matchingAliases.includes('lt-lg') ) {
          this.drawerMode = 'over';
          this.handleDrawerToggle( false );
        }
        else {
          this.drawerMode = 'side';
        }
      });

    this.filters$ = this._store.select( SearchProjectState.filters )
      .pipe(
        map(filters => toPairs( filters )),
        map(pairs => pairs.map(([ key, value ]) => ({ key, value }))),
      );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  handleFilterUpdate(filters: any): void {
    this._store.dispatch( new SearchProject.Search(filters) );
  }

  handleRemoveFilter(id: string): void {
    this._store.selectOnce( SearchProjectState.filters ) 
      .pipe(
        map(filters => omit( filters, id )),
        tap(filters => this.updateUrlQueryParams( filters )),
      )
      .subscribe();
  }

  handleDrawerToggle(isOpen: boolean): void {
    this._store.dispatch( new UiPreferences.ToggleProjectIndexDrawerOpened(isOpen) );
  }

  private updateUrlQueryParams(queryParams: any): void {
    this._router.navigate([], { queryParams, queryParamsHandling: '' });
  }
}
