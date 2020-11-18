import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { isNil } from 'lodash';
import { merge, Subject } from 'rxjs';
import { delay, map, takeUntil, tap } from 'rxjs/operators';
import { Slide } from '@projects/lib-common/src/lib/states';
import { NgTippyService, Instance } from 'angular-tippy';

@Directive({
  selector: '[elementBinding]'
})
export class ElementBindingDirective implements OnInit, OnDestroy {

  private _destroy$  = new Subject();
  private _tooltip: Instance;

  @Input() elementBinding: string;

  @HostListener( 'click' ) 
  onClick() {
    // separate thread to resolve "tap" issues 
    setTimeout(() => this._store.dispatch( 
      new Slide.FocusElement( this.elementBinding )
    ));
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
    private _tippy: NgTippyService,
  ) {
    merge(
      actions$.pipe( ofActionDispatched(Slide.FocusElement) ),
      actions$.pipe( ofActionDispatched(Slide.FocusField) ),
    )
    .pipe(
      takeUntil( this._destroy$ ),
      delay( 0 ),
      map(({ name }) => name === this.elementBinding),
      tap(isActive => this.toggle( 'binding-is-active', isActive )),
      tap(isActive => this.renderTooltip( isActive )),
      tap(()       => this.handleFocusElement())
    )
    .subscribe();
  }

  ngOnInit() {
    this._tooltip = this._tippy.init(this._elementRef, {
      arrow:       true,
      allowHTML:   true,
      interactive: true,
      interactiveBorder: 30,
      theme: "light-border",
      content: `<strong>Bolded content</strong>`,
    });
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

  renderTooltip( isActive: boolean) {
    if ( isActive ) {
      this._tooltip.show();
      this._tooltip.set({ trigger: "manual" });
      this._tooltip.disable();
    }
    else {
      this._tooltip.hide();
      this._tooltip.set({ trigger: "mouseenter focus" });
      this._tooltip.enable();
    }
  }

  handleFocusElement(): void {
    this._elementRef.nativeElement.scrollIntoViewIfNeeded({
      block:    "end",
      inline:   "end",
      behavior: "smooth",
    });
  }
}
