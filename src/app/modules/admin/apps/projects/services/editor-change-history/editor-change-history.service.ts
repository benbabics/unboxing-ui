import { EventEmitter, Injectable } from '@angular/core';
import { Actions, Store } from '@ngxs/store';
import { EntityActionType, ofEntityActionSuccessful, UpdateActive } from '@ngxs-labs/entity-state';
import { debounceTime, filter, tap, withLatestFrom } from 'rxjs/operators';
import { Slide, SlideState, Stack } from '@projects/lib-common/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class EditorChangeHistoryService {

  private _history: Map<string, Stack>;

  changes: Stack;
  onChange: EventEmitter<void> = new EventEmitter();

  get totalOfChanges(): number {
    return this.catalog.reduce((n, { changes }) => n + changes.index, 0);
  }
  
  get catalog() {
    return [ ...this._history.entries() ]
      .map(([ id, changes ]) => ({ id, changes }));
  }

  get hasPrevious(): boolean {
    return this.catalog.some(({ changes }) => changes.hasPrevious);
  }
  get hasNext(): boolean {
    return this.catalog.some(({ changes }) => changes.hasNext);
  }
  
  constructor(
    actions$: Actions,
    private store: Store,
  ) {
    this._history = new Map();
    this.reset();

    store.select( SlideState.active )
      .pipe(
        filter(slide => !!slide),
        tap(({ id }) => this.changes = this._history.get( `${ id }` )), // TODO: deserialize payload ids to string
      )
      .subscribe();

    actions$
      .pipe(
        ofEntityActionSuccessful( SlideState, EntityActionType.UpdateActive ),
        withLatestFrom( store.select(SlideState.activeId) ),
        debounceTime( 250 ),
        filter(([{ payload }]) => payload != this.changes.item),
        tap(([{ payload }, id]) => this._history.get( `${ id }` ).add( payload )), // TODO: deserialize payload ids to string
      )
      .subscribe(() => this.onChange.emit());
  }

  reset(): void {
    this._history.clear();

    const slides = this.store.selectSnapshot( SlideState.entitiesMap );
    Object.keys( slides ).forEach(key => {
      const { attributes } = slides[ key ];
      this._history.set(key, new Stack([{ attributes }]));
    });
  }

  undo(): void {
    this.changes.previous();
    this.updateActiveSlide( this.changes.item );
  }

  redo(): void {
    this.changes.next();
    this.updateActiveSlide( this.changes.item );
  }

  private updateActiveSlide(slide: Slide): void {
    this.store.dispatch( new UpdateActive(SlideState, slide) );
  }
}
