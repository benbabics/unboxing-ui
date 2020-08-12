import { Store } from '@ngxs/store';
import { App } from '../../../../projects/lib-common/src/public-api';

export function CurrentUserStateFactory(store: Store) {
  return () => store.dispatch( new App.Start() );
}
