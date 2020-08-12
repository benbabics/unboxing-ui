import { Store } from '@ngxs/store';
import { App } from '../../states/app/app.action';

export function CurrentUserStateFactory(store: Store) {
  return () => store.dispatch(new App.Start());
}
