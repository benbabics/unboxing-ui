import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { Slide } from '@projects/lib-common/src/lib/states';
import { Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Directive({
  selector: '[fieldBinding]'
})
export class FieldBindingDirective implements OnDestroy {

  private _destroy$ = new Subject();

  @Input() fieldBinding: string;

  @HostListener( 'click' ) 
  onClick() {
    this._store.dispatch( new Slide.FocusField(this.fieldBinding) );
  }

  @HostListener( 'blur' )
  onBlur() {
    this._store.dispatch( new Slide.FocusField("") );
  }

  constructor(
    actions$: Actions,
    private _store: Store,
    private _elementRef: ElementRef,
  ) {
    actions$.pipe(
      ofActionDispatched( Slide.FocusElement ),
      takeUntil( this._destroy$ ),
      filter(({ name }) => name === this.fieldBinding),
      tap(() => this.handleFocusField()),
    )
    .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  handleFocusField(): void {
    this._elementRef.nativeElement.scrollIntoViewIfNeeded({ block: 'end', inline: 'end', behavior: 'smooth' });
    this._elementRef.nativeElement.focus();
  }
}
