import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isNil } from 'lodash';
import { Subject } from 'rxjs';
import { filter, map, mapTo, startWith, tap, takeUntil } from 'rxjs/operators';

export interface MenuItem {
  label: string;
  url: string;
}

@Component({
  selector: 'lib-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  
  static readonly ROUTE_DATA_BREADCRUMB = "breadcrumb";
  menuItems: MenuItem[];
  
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    const stream$ = new Subject();
    stream$.pipe(
      takeUntil( this._destroy$ ),
      mapTo( this._activatedRoute.root ),
      map(route => this.createBreadcrumbs( route )),
      tap(menuItems => this.menuItems = menuItems),
    )
    .subscribe();
    
    // initial value
    stream$.next();
    
    // navigation changes
    this._router.events.pipe(
      takeUntil( this._destroy$ ),
      filter(evt => evt instanceof NavigationEnd),
      tap(() => stream$.next())
    )
    .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: MenuItem[] = []): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if ( children.length === 0 ) {
      return breadcrumbs;
    }

    for ( const child of children ) {
      const routeURL: string = child.snapshot.url.map( segment => segment.path ).join( "/" );
      if ( routeURL !== "" ) {
        url += `/${ routeURL }`;
      }

      const label = child.snapshot.data[ BreadcrumbsComponent.ROUTE_DATA_BREADCRUMB ];
      if ( !isNil(label) ) {
        breadcrumbs.push({ label, url });
      }

      return this.createBreadcrumbs( child, url, breadcrumbs );
    }
  }
}
