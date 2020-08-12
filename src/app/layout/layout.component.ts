import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { TreoConfigService } from '@treo/services/config';
import { TreoMediaWatcherService } from '@treo/services/media-watcher';
import { Layout } from 'app/layout/layout.types';
import { AppConfig } from 'app/core/config/app.config';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit, OnDestroy {
  
  config: AppConfig;
  layout: Layout;
  theme: 'dark' | 'light';

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _treoConfigService: TreoConfigService,
    private _treoMediaWatcherService: TreoMediaWatcherService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    combineLatest([
      this._treoConfigService.config$,
      this._treoMediaWatcherService.onMediaQueryChange$([
        '(prefers-color-scheme: dark)',
        '(prefers-color-scheme: light)'
      ])
    ])
    .pipe(
      takeUntil(this._unsubscribeAll),
      map(([config, mql]) => {
        if ( config.theme !== 'auto' ) {
          return config.theme;
        }

        if ( mql.breakpoints['(prefers-color-scheme: dark)'] === true ) {
          return 'dark';
        }

        return 'light';
      })
    )
    .subscribe((theme) => {
      this.theme = theme;
      this._updateTheme();
    });

    this._treoConfigService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: AppConfig) => {
        this.config = config;
        this._updateLayout();
      });

    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => this._updateLayout());
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private _updateLayout(): void {
    // Get the current activated route
    let route = this._activatedRoute;
    while ( route.firstChild ) {
      route = route.firstChild;
    }

    // 1. Set the layout from the config
    this.layout = this.config.layout;

    // 2. Get the query parameter from the current route and
    // set the layout and save the layout to the config
    const layoutFromQueryParam = (route.snapshot.queryParamMap.get('layout') as Layout);
    if ( layoutFromQueryParam ) {
      this.config.layout = this.layout = layoutFromQueryParam;
    }

    // 3. Iterate through the paths and change the layout as we find
    // a config for it.
    //
    // The reason we do this is that there might be empty grouping
    // paths or componentless routes along the path. Because of that,
    // we cannot just assume that the layout configuration will be
    // in the last path's config or in the first path's config.
    //
    // So, we get all the paths that matched starting from root all
    // the way to the current activated route, walk through them one
    // by one and change the layout as we find the layout config. This
    // way, layout configuration can live anywhere within the path and
    // we won't miss it.
    //
    // Also, this will allow overriding the layout in any time so we
    // can have different layouts for different routes.
    const paths = route.pathFromRoot;
    paths.forEach((path) => {
        // Check if there is a 'layout' data
        if ( path.routeConfig && path.routeConfig.data && path.routeConfig.data.layout ) {
          // Set the layout
          this.layout = path.routeConfig.data.layout;
        }
    });
  }

  private _updateTheme(): void {
    // Find the class name for the previously selected theme and remove it
    this._document.body.classList.forEach((className) => {
      if ( className.startsWith('treo-theme-') ) {
        this._document.body.classList.remove(className);
        return;
      }
    });

    // Add class name for the currently selected theme
    this._document.body.classList.add(`treo-theme-${this.theme}`);
  }

  setLayout(layout: string): void {
    this._router.navigate([], {
      queryParams: { layout: null },
      queryParamsHandling: 'merge'
    })
    .then(() => {
      this._treoConfigService.config = {layout};
    });
  }

  setTheme(change: MatRadioChange): void {
    this._treoConfigService.config = { theme: change.value };
  }
}
