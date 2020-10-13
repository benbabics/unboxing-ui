import { Store } from '@ngxs/store';
import { App } from 'app/data';

export function CurrentUserStateFactory(store: Store) {
  return () => store.dispatch( new App.Start() );
}
