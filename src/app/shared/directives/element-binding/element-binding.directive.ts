import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { Slide } from '@projects/lib-common/src/lib/states';
import { isNil } from 'lodash';
import { merge, Subject } from 'rxjs';
import { delay, map, takeUntil, tap } from 'rxjs/operators';

@Directive({
  selector: '[elementBinding]'
})
export class ElementBindingDirective implements OnDestroy {

  private _destroy$ = new Subject();

  @Input() elementBinding: string;

  @HostListener( 'click' ) 
  onClick() {
    // separate thread to resolve "tap" issues 
    setTimeout(() => this._store.dispatch( new Slide.FocusElement(this.elementBinding) ));
  }
  
  @HostListener( 'mouseenter' ) 
  onMouseEnter() {
    this.toggle( 'binding-has-hover', true );
  }
  @HostListener( 'mouseleave' )
  onMouseLeave() {
    this.toggle( 'binding-has-hover', false );
  }

  constructor(
    actions$: Actions,
    private _store: Store,
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
  ) {
    merge(
      actions$.pipe( ofActionDispatched(Slide.FocusElement) ),
      actions$.pipe( ofActionDispatched(Slide.FocusField) ),
    )
    .pipe(
      takeUntil( this._destroy$ ),
      map(({ name }) => name === this.elementBinding),
      delay( 100 ),
      tap(isActive => this.toggle( 'binding-is-active', isActive )),
      tap(() => this.handleFocusElement())
    )
    .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  toggle(cname: string, isActive?: boolean) {
    if ( isNil(isActive) ) {
      isActive = !this._elementRef.nativeElement.classList.contains( cname );
    }
    this._renderer[ isActive ? "addClass" : "removeClass" ]( this._elementRef.nativeElement, cname );
  }

  handleFocusElement(): void {
    this._elementRef.nativeElement.scrollIntoViewIfNeeded({ block: 'end', inline: 'end', behavior: 'smooth' });
  }
}
