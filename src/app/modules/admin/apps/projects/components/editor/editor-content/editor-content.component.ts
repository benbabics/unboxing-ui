import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { Actions, Store } from '@ngxs/store';
import { EntityActionType, ofEntityActionSuccessful, SetActive } from '@ngxs-labs/entity-state';
import { IPostMessageBridge, IPostMessageEventTarget, PostMessageBridgeFactory } from '@tekool/ngx-post-message-angular-9';
import { ProjectActiveState, SlideState } from 'app/data';
import { map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'editor-content',
  templateUrl: './editor-content.component.html',
  styleUrls: ['./editor-content.component.scss']
})
export class EditorContentComponent implements OnInit, OnDestroy {

  private _bridge: IPostMessageBridge;
  private _destroy$ = new Subject();
  
  frameHeight: string;
  
  constructor(
    actions$: Actions,
    private _store: Store,
    @Inject( PostMessageBridgeFactory ) private _bridgeFactory: PostMessageBridgeFactory,
  ) {
    const assignAction = (resource: any, action: EntityActionType) =>
      actions$.pipe(ofEntityActionSuccessful(resource, action))
        .pipe(
          map(({ payload }) => ({ action, resource: resource.name, data: payload })),
          tap(action => this._sendAction( action )),
        )
        .subscribe();

    assignAction( SlideState, EntityActionType.SetActive );
    assignAction( SlideState, EntityActionType.Update );
    assignAction( SlideState, EntityActionType.UpdateActive );
  }

  ngOnInit() {
    this._bridge = this._bridgeFactory.makeInstance()
      .setEnableLogging( true )
      .connect( window, window.frames[0] )
      .makeBridge( 'ReadyEditor' )
      .makeBridge( 'ReadyPreview' )
      .makeBridge( 'ActionUpdateEditor' )
      .makeBridge( 'ActionUpdatePreview' )
      .addListener( 'ReadyPreview', () => this._initialPreviewActions() )
      .addListener( 'ActionUpdatePreview', action => this._handleActionUpdatePreview(action) )
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
    
    this._bridge.removeAllListeners( 'ReadyPreview' );
    this._bridge.removeAllListeners( 'ActionUpdatePreview' );
  }

  private _initialPreviewActions(): void {
    const project = this._store.selectSnapshot( ProjectActiveState.project );
    
    // create project
    this._sendAction({
      resource: ProjectActiveState.name,
      action:   EntityActionType.CreateOrReplace,
      data:     project,
    });

    // init active project
    this._sendAction({
      resource: ProjectActiveState.name,
      action:   EntityActionType.SetActive,
      data:     project.id,
    });

    // init active slide
    this._sendAction({
      resource: SlideState.name,
      action:   EntityActionType.SetActive,
      data:     this._store.selectSnapshot( SlideState.activeId ),
    });

    // notify listener editor is ready
    this._bridge.sendMessage( 'ReadyEditor', project.themeId );
    this._bridge.removeAllListeners( 'ReadyPreview' );
  }

  private _handleActionUpdatePreview({ type, data }: any): void {
    switch(type) {
      case "page-active":
        const slide = this._store.selectSnapshot( SlideState.getByTemplateId(data.pageId) );
        this._store.dispatch( new SetActive(SlideState, slide.id) );
      break;
    }
  }

  private _sendAction(params: { resource: string, action: EntityActionType, data: any }): void {
    this._bridge?.sendMessage( 'ActionUpdateEditor', params );
  }
}
