import { EventEmitter, Injectable } from '@angular/core';
import { Actions, Store } from '@ngxs/store';
import { EntityActionType, ofEntityActionSuccessful, UpdateActive } from '@ngxs-labs/entity-state';
import { merge } from "rxjs";
import { debounceTime, filter, flatMap, tap, withLatestFrom } from 'rxjs/operators';
import { Slide, SlideState, Stack } from '@projects/lib-common/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class EditorChangeHistoryService {

  private _history: Map<string, Stack>;
  private _reset$ = new EventEmitter();

  changes: Stack;
  catalog: { id: string, changes: Stack }[] = [];
  onChange: EventEmitter<void> = new EventEmitter();

  get totalOfChanges(): number {
    return this.catalog.reduce((n, { changes }) => n + changes.index, 0);
  }

  get hasPrevious(): boolean {
    return this.catalog.some(({ changes }) => changes.hasPrevious);
  }
  get hasNext(): boolean {
    return this.catalog.some(({ changes }) => changes.hasNext);
  }
  
  constructor(
    actions$: Actions,
    private _store: Store,
  ) {
    this._history = new Map();
    this.reset();

    merge(
      this._reset$,
      _store.select( SlideState.active ).pipe( filter(slide => !!slide) ),
    )
    .pipe( flatMap(() => _store.select(SlideState.activeId)) )
    .subscribe(id => this.changes = this._history.get( `${ id }` )); // TODO: deserialize payload ids to string

    actions$
      .pipe(
        ofEntityActionSuccessful( SlideState, EntityActionType.UpdateActive ),
        withLatestFrom( _store.select(SlideState.activeId) ),
        debounceTime( 250 ),
        filter(([{ payload }]) => payload != this.changes.item),
        tap(([{ payload }, id]) => this._history.get( `${ id }` ).add( payload )), // TODO: deserialize payload ids to string
        tap(() => this._assignCatalog()),
      )
      .subscribe(() => this.onChange.emit());
  }

  reset(): void {
    this._history.clear();

    const slides = this._store.selectSnapshot( SlideState.entitiesMap );
    Object.keys( slides ).forEach(key => {
      const { attributes } = slides[ key ];
      this._history.set(key, new Stack([{ attributes }]));
    });

    this._assignCatalog();
    this._reset$.emit();
  }

  undo(): void {
    this.changes.previous();
    this._updateActiveSlide( this.changes.item );
  }

  redo(): void {
    this.changes.next();
    this._updateActiveSlide( this.changes.item );
  }

  private _updateActiveSlide(slide: Slide): void {
    this._store.dispatch( new UpdateActive(SlideState, slide) );
  }

  private _assignCatalog(): void {
    this.catalog = [ ...this._history.entries() ]
      .map(([ id, changes ]) => ({ id, changes }));
  }
}
