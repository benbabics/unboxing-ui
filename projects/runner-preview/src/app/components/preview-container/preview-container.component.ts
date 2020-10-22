import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PostMessageBridgeFactory, IPostMessageBridge } from '@tekool/ngx-post-message-angular-9';
import { Add, Remove, SetActive, UpdateActive, Update, CreateOrReplace, EntityActionType, ofEntityActionSuccessful } from '@ngxs-labs/entity-state';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-preview-container',
  template: '<router-outlet></router-outlet>'
})
export class PreviewContainerComponent implements OnInit, OnDestroy {

  private _bridge: IPostMessageBridge;
  private _destroy$ = new Subject<boolean>();
  
  constructor(
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
      .makeBridge( 'Foo' )
      .makeBridge( 'ReadyPreview')
      .makeBridge( 'ReadyEditor')
      .makeBridge( 'ActionUpdateEditor')
      .makeBridge( 'ActionUpdatePreview')
      .addListener( 'ReadyEditor', () => this._handleReadyEditor() )
      .addListener( 'ActionUpdateEditor', params => this._handleActionUpdateEditor(params) )
      .sendMessage( 'ReadyPreview' );

      setTimeout(() => {
        this._bridge.sendMessage('Foo', { data: 'foo message :)' });
      }, 5000)
  }

  private _handleReadyEditor(): void {
    console.log('* _handleReadyEditor');
  }

  private _handleActionUpdateEditor({ resource, action, data }: { resource: string, action: EntityActionType, data: any }): void {
    console.log('* _handleActionUpdateEditor', { resource, action, data });
  }
}
