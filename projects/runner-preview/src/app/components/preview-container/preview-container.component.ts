import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PostMessageBridgeFactory, IPostMessageBridge } from '@tekool/ngx-post-message-angular-9';
import { Add, Remove, SetActive, UpdateActive, Update, CreateOrReplace, EntityActionType, ofEntityActionSuccessful } from '@ngxs-labs/entity-state';
import { Subject } from 'rxjs';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AssetDirectoryState, AssetElementState, ProjectActive, ProjectActiveState, ProjectState, Slide, SlideState, ThemeState } from '@libCommon';

@Component({
  selector: 'app-preview-container',
  template: '<router-outlet></router-outlet>',
  styles: [ ':host { width: 100%; background-color: #fff; }' ],
})
export class PreviewContainerComponent implements OnInit, OnDestroy {

  private _bridge: IPostMessageBridge;
  private _destroy$ = new Subject();
  
  constructor(
    private _actions$: Actions,
    private _store: Store,
    private _router: Router,
    private _route: ActivatedRoute,
    @Inject( PostMessageBridgeFactory ) private _bridgeFactory: PostMessageBridgeFactory,
  ) { }

  ngOnInit() {
    this._setupBridge();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();

    this._bridge.removeAllListeners( 'ReadyEditor' );
    this._bridge.removeAllListeners( 'ActionUpdateEditor' );
  }

  private _setupBridge() {
    this._bridge = this._bridgeFactory.makeInstance()
      .setEnableLogging( true )
      .connect( window, window.top )
      .makeBridge( 'ReadyPreview')
      .makeBridge( 'ReadyEditor')
      .makeBridge( 'ActionUpdateEditor')
      .makeBridge( 'ActionUpdatePreview')
      .addListener( 'ReadyEditor',        themeId => this._handleReadyEditor(themeId) )
      .addListener( 'ActionUpdateEditor', params  => this._handleActionUpdateEditor(params) )
      .sendMessage( 'ReadyPreview' );

    this._store.select( SlideState.active )
      .pipe(
        take( 1 ),
        filter(slide => !!slide),
        map(({ templateId }) => ({ pageId: templateId })),
      )
      .subscribe(data => this._handleSendAction({ type: "page-active", data }));

    this._actions$.pipe(
      ofActionDispatched( Slide.FocusElement ),
      takeUntil( this._destroy$ ),
    )
    .subscribe(({ name }) => this._handleSendAction({ type: "element-focus", data: name }));

    this._actions$.pipe(
      ofActionDispatched( Slide.ClearElement ),
      takeUntil( this._destroy$ ),
    )
    .subscribe(({ name }) => this._handleSendAction({ type: "element-clear", data: name }));

    const findRoute = route =>
      route.snapshot.data.isThemeWrapper ? route.firstChild : findRoute( route.firstChild );

    this._router.events
      .pipe(
        takeUntil( this._destroy$ ),
        filter(event => event instanceof NavigationEnd),
        map(() => findRoute( this._route ).snapshot.routeConfig.path),
        map(pageId => ({ pageId })),
      )
      .subscribe(data => this._handleSendAction({ type: 'page-active', data }))

    this._store.select( SlideState.active )
      .pipe(
        takeUntil( this._destroy$ ),
        filter(slide => !!slide),
      )
      .subscribe(slide => this._renderComponent( slide ));
  }

  private _handleReadyEditor(themeId: string): void {
    const loadChildren = () => {
      switch(themeId) {
        case "theme-default":
          return import("@projects/theme-default/src/app/app.module").then(m => m.AppModule);
      }
    };
    
    this._route.routeConfig.children = [{
      path: "",
      loadChildren,
      // resolve: { project: ProjectResolverService },
    }];

    const config = this._router.config;
    this._router.resetConfig( config );
    this._router.navigateByUrl( this._router.url );
  }

  private _handleActionUpdateEditor({ resource, action, data }: { resource: string, action: EntityActionType, data: any }): void {
    const states = [
      ProjectState,
      ProjectActiveState,
      AssetDirectoryState,
      AssetElementState,
      { name: "slide" },
      SlideState,
      ThemeState,
    ];
    const reducer = (factory, state) => state.name === resource ? state : factory;
    const entity  = states.reduce( reducer, null );

    const factoryInstance = action => {
      switch(action) {
        case "add":               return new Add( entity, data );
        case "remove":            return new Remove( entity, data );
        case "setActive":         return new SetActive( entity, data );
        case "updateActive":      return new UpdateActive( entity, data );
        case "update":            return new Update( entity, data.id, data.data );
        case "createOrReplace":   return new CreateOrReplace( entity, data );
        case "setAssociations":   return new ProjectActive.SetAssociations(data);
        case "clearAssociations": return new ProjectActive.ClearAssociations();
        case "focusField":        return new Slide.FocusField( data );
      }
    }

    this._store.dispatch( factoryInstance(action) );
  }

  private _renderComponent(slide: Slide): void {
    this._router.navigate([ 'preview', slide.templateId ]);
  }

  private _handleSendAction(action: any): void {
    this._bridge.sendMessage( 'ActionUpdatePreview', action );
  }
}
