import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { toPairs, omit } from 'lodash';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { map, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Select, Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { TreoMediaWatcherService } from '@treo/services/media-watcher/media-watcher.service';
import { Project, ProjectState, ProjectSearch, ProjectSearchState, UiPreferencesState, UiPreferences } from '../../../../../../../../projects/lib-common/src/public-api';

@Component({
  selector: 'project-index',
  templateUrl: './project-index.component.html',
  styleUrls: ['./project-index.component.scss'],
})
export class ProjectIndexComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();

  drawerMode: 'over' | 'push';
  drawerOpened: boolean;
  projectForm: FormGroup;
  isLoading: boolean = true;

  filters$: Observable<any>;
  isSmallScreen$: BehaviorSubject<boolean> = new BehaviorSubject( false );
  
  @ViewChild( 'drawer' ) drawer: MatDrawer;

  @Select( ProjectSearchState.results ) projects$: Observable<Project[]>;
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
    this.drawerMode = 'push';

    // on ProjectSearch.SetFilters, update the URL queryParams
    actions$.pipe(
      takeUntil( this._destroy$ ),
      ofActionSuccessful( ProjectSearch.SetFilters ),
      withLatestFrom( _store.select(ProjectSearchState.filters) ),
      map(([ payload, filters ]) => filters),
      tap(filters => this.updateUrlQueryParams( filters )),
    )
    .subscribe();
  }

  ngOnInit(): void {
    this._treoMediaWatcherService.onMediaChange$
      .pipe(
        takeUntil( this._destroy$ ),
        map(({ matchingAliases }) => matchingAliases.includes( 'lt-lg' )),
        tap(isSmallScreen => this.isSmallScreen$.next( isSmallScreen )),
      )
      .subscribe(isSmallScreen => {
        this.drawerMode = isSmallScreen ? 'over' : 'push';
        if ( isSmallScreen ) this.handleDrawerToggle( false );
      });

    this._store.select( ProjectSearchState.loading )
      .pipe(
        takeUntil( this._destroy$ ),
        tap(isLoading => this.isLoading = isLoading),
      )
      .subscribe();

    this.filters$ = this._store.select( ProjectSearchState.filters )
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
    this._store.dispatch( new ProjectSearch.Search(filters) )
    this.isSmallScreen$.pipe(
      take( 1 ),
      // filter(isSmall => isSmall),
      tap(() => this.handleDrawerToggle( false )),
    )
    .subscribe();
  }

  handleRemoveFilter(id: string): void {
    this._store.selectOnce( ProjectSearchState.filters ) 
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
