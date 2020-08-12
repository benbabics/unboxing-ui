import { State, Action, Selector } from '@ngxs/store';
import { StateContext, Store } from '@ngxs/store';
import { defaultEntityState, EntityStateModel, EntityState, IdStrategy, Add, Update, SetLoading } from '@ngxs-labs/entity-state';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { HttpClient } from '@angular/common/http';
import { finalize, flatMap } from 'rxjs/operators';
import { sortBy } from 'lodash';
import { Brand } from './brand.action';
import { Account } from './../account/account.action';
import { AccountState } from './../account/account.state';

export interface BrandStateModel extends EntityStateModel<Brand> {
  manageBrandForm,
}

@State({
  name: 'brand',
  defaults: {
    ...defaultEntityState(),
    manageBrandForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    }
  }
})
export class BrandState extends EntityState<Brand> {

  get account(): Account {
    return this.store.selectSnapshot(AccountState.active);
  }
  
  @Selector()
  static sortedEntities(state: BrandStateModel) {
    return sortBy(state.entities, ['name']);
  }

  constructor(
    private store: Store,
    private http: HttpClient,
  ) {
    super(BrandState, 'id', IdStrategy.EntityIdGenerator);
  }

  @Action(Brand.Manage)
  open(ctx: StateContext<BrandStateModel>, action: Brand.Manage) {
    this.store.dispatch(new UpdateFormValue({
      path: 'brand.manageBrandForm',
      value: action.payload,
    }));
  }

  @Action(Brand.Create)
  crudCreate(ctx: StateContext<BrandStateModel>, { payload }: Brand.Create) {
    this.toggleLoading(true);
    
    payload.accountId = this.account.id;
    return this.http.post<Brand>(`/api/accounts/${payload.accountId}/brands`, payload)
      .pipe(
        flatMap(brand => this.store.dispatch(new Add(BrandState, brand))),
        finalize(() => this.toggleLoading(false)),
      );
  }

  @Action(Brand.Update)
  crudUpdate(ctx: StateContext<BrandStateModel>, { payload }: Brand.Update) {
    this.toggleLoading(true);

    payload.accountId = this.account.id;
    return this.http.put<Brand>(`/api/brands/${payload.id}`, payload)
      .pipe(
        flatMap(brand => this.store.dispatch(new Update(BrandState, brand.id, brand))),
        finalize(() => this.toggleLoading(false)),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this.store.dispatch(new SetLoading(BrandState, isLoading));
  }
}
