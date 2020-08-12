import { Stack } from '../stack/stack';

export class Carousel extends Stack {

  get indexPrevious(): number {
    const previous = this._index - 1;
    return previous < 0 ? this.stack.length - 1 : previous;
  }
  get indexNext(): number {
    const next = this._index + 1;
    return next === this.stack.length ? 0 : next;
  }
}
