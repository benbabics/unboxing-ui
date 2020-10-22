import { Component, Inject, OnInit } from '@angular/core';
import { IPostMessageBridge, IPostMessageEventTarget, PostMessageBridgeFactory } from '@tekool/ngx-post-message-angular-9';

@Component({
  selector: 'editor-content',
  templateUrl: './editor-content.component.html',
  styleUrls: ['./editor-content.component.scss']
})
export class EditorContentComponent implements OnInit {

  frameHeight: string;
  private _bridge: IPostMessageBridge;
  
  constructor(
    @Inject( PostMessageBridgeFactory ) private _bridgeFactory: PostMessageBridgeFactory,
  ) { }

  ngOnInit() {
    this._bridge = this._bridgeFactory.makeInstance()
      .setEnableLogging(true)
      .connect(window, window.frames[0])
      .makeBridge( 'ReadyEditor' )
      .makeBridge( 'ReadyPreview' )
      .makeBridge( 'Foo')
      .makeBridge( 'ActionUpdateEditor' )
      .makeBridge( 'ActionUpdatePreview' )
      .addListener( 'Foo', data => console.log('* Foo', data))
      .addListener( 'ReadyPreview', () => this._initialPreviewActions() )
      .addListener( 'ActionUpdatePreview', action => this._handleActionUpdatePreview(action) )
  }

  private _initialPreviewActions(): void {
    console.log('* _initialPreviewActions');
  }

  private _handleActionUpdatePreview({ type, data }: any): void {
    console.log('* _handleActionUpdatePreview', { type, data });
  }
}
