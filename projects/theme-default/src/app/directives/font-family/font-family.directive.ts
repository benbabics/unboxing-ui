import { Directive, Input, ElementRef } from '@angular/core';
import { get } from 'lodash';
import { FontMap, Font } from '@libCommon';

@Directive({
  selector: '[fontFamily]'
})
export class FontFamilyDirective {

  private static _loadedFonts: string[] = [];

  _initialFontFamily: string;
  _fontFamily: string;

  @Input() 
  get fontFamily(): string {
    return this._fontFamily;
  }
  set fontFamily(fontFamily: string) {
    this._fontFamily = fontFamily;

    if ( !this._fontFamily ) {
      this.updateFontFamily( this._initialFontFamily );
    }
    else if ( this.selectedFont ) {
      this.loadFont().then(() => 
        this.updateFontFamily( this.selectedFont.family )
      );
    }
  }

  get selectedFont(): Font {
    return FontMap.get( this.fontFamily );
  }

  constructor(
    private _el: ElementRef,
  ) {
    const style = window.getComputedStyle( _el.nativeElement, null );
    this._initialFontFamily = style.getPropertyValue( 'font-family' );
  }

  private updateFontFamily(fontFamily: string): void {
    this._el.nativeElement.style.fontFamily = fontFamily;
  }

  private loadFont(): Promise<any> {
    if (!FontFamilyDirective._loadedFonts.includes( this.fontFamily )) {
      FontFamilyDirective._loadedFonts.push( this.fontFamily );
      
      return new Promise((resolve, reject) => {
        const style = document.createElement( 'style' );
        style.textContent = `@import "http://localhost:4200/${ this.selectedFont.css }"`;

        const int = setInterval(() => {
          if ( get(style, 'sheet.cssRules') ) {
            resolve();
            return clearInterval( int );
          }

          reject();
        }, 10);

        document.getElementsByTagName( 'head' )[ 0 ].appendChild( style );
      });
    }

    return Promise.resolve();
  }
}
