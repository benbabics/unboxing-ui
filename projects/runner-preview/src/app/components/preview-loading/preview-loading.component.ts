import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-preview-loading',
  template: '<ngx-spinner></ngx-spinner>'
})
export class PreviewLoadingComponent implements OnInit, OnDestroy {

  constructor(
    private _spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this._spinner.show();
  }

  ngOnDestroy() {
    this._spinner.hide();
  }
}
