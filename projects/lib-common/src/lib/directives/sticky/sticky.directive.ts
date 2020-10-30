import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[libSticky]'
})
export class StickyDirective {

  private _element: HTMLElement;
  private _isSticky: boolean = false;
  private _offsetTop: number = 0;
  
  @HostListener('window:scroll', ['$event'])
  handleScroll(evt: any) {
    const docTop = this._getDocumentPosition();
    const offset = this._offsetTop;

    if (docTop > offset && !this._isSticky) {
      this._makeSticky();
      this._isSticky = true;
    }
    else if (docTop < offset && this._isSticky) {
      this._resetSticky();
      this._isSticky = false;
    }
  }

  constructor(el: ElementRef) {
    this._element = el.nativeElement;
    this._offsetTop = this._element.offsetTop;
  }

  private _getDocumentPosition(): number {
    const docEl = document.documentElement;
    const docRect = docEl.getBoundingClientRect();

    return -docRect.top || document.body.scrollTop || window.scrollY || docEl.scrollTop || 0;
  }

  private _makeSticky() {
    this._element.style.cssText += 'position: -webkit-sticky; position: sticky; ';
    this._element.style.top = '0px';
  }

  private _resetSticky() {
    Object.assign(this._element.style, {
      position:        '',
      top:             '',
      boxShadow:       '',
      webkitBoxShadow: '',
    });
  }
}
