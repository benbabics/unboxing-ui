import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { isArray, isNil } from 'lodash';
import { merge, Subject } from 'rxjs';
import { delay, map, takeUntil, tap } from 'rxjs/operators';
import { Slide } from '@projects/lib-common/src/lib/states';
import { NgTippyService, Instance } from 'angular-tippy';

export enum ElementBindingAction {
  Edit   = "EDIT",
  Delete = "DELETE",
}

export interface ElementBindingButton {
  action: ElementBindingAction;
  label: string;
  name: string;
}

@Directive({
  selector: '[elementBinding]'
})
export class ElementBindingDirective implements OnInit, OnDestroy {

  private _destroy$  = new Subject();
  private _tooltip: Instance;

  @Input() elementBindingLabel: string;
  @Input() elementBinding: ElementBindingButton[];
  
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
      map(({ name }) => this.elementBinding.map(({ name }) => name).includes( name )),
      tap(isActive => this.toggle( 'binding-is-active', isActive )),
      tap(isActive => this.renderTooltip( isActive )),
      tap(()       => this.handleFocusElement())
    )
    .subscribe();
  }

  ngOnInit() {
    function renderButton(data: ElementBindingButton): string {
      let label;

      switch( data.action ) {
        case ElementBindingAction.Edit:
          label = data.label || "Edit Text";
          break;

        case ElementBindingAction.Delete:
          label = data.label || "Delete";
          break;
      }

      return `
        <button
          class="btn"
          data-action="${ data.action }"
          data-name="${ data.name }">
          ${ label }
        </button>
      `;
    }
    
    this._tooltip = this._tippy.init(this._elementRef, {
      arrow:       true,
      allowHTML:   true,
      interactive: true,
      interactiveBorder: 30,
      theme: "light-border",
      content: `
        <strong>${ this.elementBindingLabel }</strong>
        ${ this.elementBinding.map(button => renderButton( button )).join( '' ) }
      `,
      onShown: (instance) => {
        const handleClick = ({ target }) => {
          switch ( target.dataset.action ) {
            case ElementBindingAction.Edit:
            case ElementBindingAction.Delete:
              this._dispatchFocusEvent( target.dataset.name );
            break;
          }

          instance.hide();
        };

        instance.popper.addEventListener( 'click', handleClick );
      },
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
      this._tooltip.enable();
      this._tooltip.hide();
      this._tooltip.set({ trigger: "mouseenter focus" });
    }
  }

  handleFocusElement(): void {
    this._elementRef.nativeElement.scrollIntoViewIfNeeded({
      block:    "end",
      inline:   "end",
      behavior: "smooth",
    });
  }

  private _dispatchFocusEvent(name: string): void {
    setTimeout(() => this._store.dispatch( 
      new Slide.FocusElement( name )
    ));
  }
}
