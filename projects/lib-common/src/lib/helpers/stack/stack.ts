import { EventEmitter } from '@angular/core';

export class Stack {

  protected _index: number = 0;

  onChangeIndex$ = new EventEmitter();

  get length(): number {
    return this.stack.length;
  }

  get index(): number {
    return this._index;
  }
  get indexPrevious(): number {
    const previous = this._index - 1;
    return previous < 0 ? this.indexFirst : previous;
  }
  get indexNext(): number {
    const next = this._index + 1;
    return next === this.stack.length ? this.indexLast : next;
  }
  get indexFirst(): number {
    return 0;
  }
  get indexLast(): number {
    return this.stack.length - 1;
  }
  get hasPrevious(): boolean {
    return this._index !== this.indexFirst;
  }
  get hasNext(): boolean {
    return this._index !== this.indexLast;
  }

  get item(): any {
    return this.stack[this._index];
  }
  get itemPrevious(): any {
    return this.stack[this.indexPrevious];
  }
  get itemNext(): any {
    return this.stack[this.indexNext];
  }
  get itemFirst(): any {
    return this.stack[this.indexFirst];
  }
  get itemLast(): any {
    return this.stack[this.indexLast];
  }
  
  constructor(
    public stack: any[] = [],
  ) { }

  restart(): void {
    this._index = this.indexFirst;
  }

  previous(): void {
    this._index = this.indexPrevious;
    this.onChangeIndex$.emit(this._index);
  }
  next(): void {
    this._index = this.indexNext;
    this.onChangeIndex$.emit(this._index);
  }

  add(item: any): void {
    this.stack.splice(this.index + 1, this.stack.length, item);
    this.next();
  }

  remove(index: number): void {
    this.stack.splice(index);
  }
}
