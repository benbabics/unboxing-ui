import { Directive, ElementRef, HostListener, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { Slide } from '@projects/lib-common/src/lib/states';
import { Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Directive({
  selector: '[fieldBinding]'
})
export class FieldBindingDirective implements OnDestroy {

  private _destroy$ = new Subject();
  private _control: NgControl;

  @Input() fieldBinding: string;

  @HostListener( 'focus' ) 
  onClick() {
    this._store.dispatch( new Slide.FocusField(this.fieldBinding) );
  }

  @HostListener( 'blur' )
  onBlur() {
    this._store.dispatch( new Slide.FocusField("") );
  }

  constructor(
    actions$: Actions,
    injector: Injector,
    private _store: Store,
    private _elementRef: ElementRef,
  ) {
    try {
      this._control = injector.get( NgControl );
    }
    catch(e) { }
    
    actions$.pipe(
      ofActionDispatched( Slide.FocusElement ),
      takeUntil( this._destroy$ ),
      filter(({ name }) => name === this.fieldBinding),
      tap(() => this.handleFocusField()),
    )
    .subscribe();

    actions$.pipe(
      ofActionDispatched( Slide.ClearElement ),
      takeUntil( this._destroy$ ),
      filter(({ name }) => name === this.fieldBinding),
      tap(() => this.handleClearField()),
    )
    .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  handleFocusField(): void {
    this._scrollIntoView();
    this._elementRef.nativeElement.focus();
  }
  handleClearField(): void {
    this._scrollIntoView();
    this._control?.control.setValue( '' );
  }
  
  private _scrollIntoView(): void {
    this._elementRef.nativeElement.scrollIntoViewIfNeeded({ 
      block:    "end",
      inline:   "end",
      behavior: "smooth"
    });
  }
}
