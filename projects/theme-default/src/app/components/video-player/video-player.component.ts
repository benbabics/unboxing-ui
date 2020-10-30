import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
// import videojs from 'video.js';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideoPlayerComponent implements OnInit {

  // vjs: videojs.Player;
  vjs: any;
  playerId: string;

  @Input() urlVideo: string;
  @Input() urlPoster: string = '/assets/shared/video-default-placeholder.png';

  ngOnInit() {
    const guid = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    this.playerId = `player-${guid}`;
  }

  ngAfterViewInit() {
    const options = {
      poster: this.urlPoster,
      sources: [{
        src:  this.urlVideo,
        type: 'application/x-mpegURL'
      }],
    };

    // this.vjs = videojs(this.playerId, options);
  }
}
