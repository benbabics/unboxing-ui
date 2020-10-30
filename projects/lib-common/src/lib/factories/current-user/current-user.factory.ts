import { Store } from '@ngxs/store';
import { App } from '@libCommon';

export function CurrentUserStateFactory(store: Store) {
  return () => store.dispatch( new App.Start() );
}
