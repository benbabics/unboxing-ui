import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, State, Action, Selector, StateContext } from '@ngxs/store';
import { defaultEntityState, EntityStateModel, EntityState, IdStrategy, Add, Update, SetLoading, Remove } from '@ngxs-labs/entity-state';
import { UpdateFormDirty, UpdateFormValue } from '@ngxs/form-plugin';
import { finalize, flatMap } from 'rxjs/operators';
import { sortBy } from 'lodash';
import { Brand } from './brand.action';
import { CurrentAccount, CurrentAccountState } from './../app/current-account';

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
@Injectable()
export class BrandState extends EntityState<Brand> {

  get account(): CurrentAccount {
    return this.store.selectSnapshot( CurrentAccountState.details );
  }
  
  @Selector()
  static sortedEntities(state: BrandStateModel) {
    return sortBy( state.entities, [ 'name' ] );
  }

  constructor(
    private store: Store,
    private http: HttpClient,
  ) {
    super(BrandState, 'id', IdStrategy.EntityIdGenerator);
  }

  @Action( Brand.Manage )
  manage(ctx: StateContext<BrandStateModel>, action: Brand.Manage) {
    const path = "brand.manageBrandForm";

    return new Promise(resolve => {
      this.store.dispatch([
        new UpdateFormValue({ path, value: action.payload }),
        new UpdateFormDirty({ path, dirty: false }),
      ])
      .subscribe(() => resolve());
    });
  }

  @Action( Brand.Create )
  crudCreate(ctx: StateContext<BrandStateModel>, { payload }: Brand.Create) {
    this.toggleLoading( true );
    
    payload.accountId = this.account.id;
    return this.http.post<Brand>( `/api/accounts/${ payload.accountId }/brands`, payload )
      .pipe(
        flatMap(brand => this.store.dispatch([
          new UpdateFormDirty({ path: "brand.manageBrandForm", dirty: false }),
          new Add( BrandState, brand ),
        ])),
        finalize(() => this.toggleLoading( false )),
      );
  }

  @Action( Brand.Update )
  crudUpdate(ctx: StateContext<BrandStateModel>, { payload }: Brand.Update) {
    this.toggleLoading( true );

    return this.http.put<Brand>( `/api/brands/${ payload.id }`, payload )
      .pipe(
        flatMap(brand => this.store.dispatch([
          new UpdateFormDirty({ path: "brand.manageBrandForm", dirty: false }),
          new Update( BrandState, brand.id, brand ),
        ])),
        finalize(() => this.toggleLoading( false )),
      );
  }

  @Action( Brand.Destroy )
  crudDestroy(ctx: StateContext<BrandStateModel>, { id }: Brand.Destroy) {
    this.toggleLoading( true );

    return this.http.delete( `/api/brands/${ id }` )
      .pipe(
        flatMap(()  => this.store.dispatch([
          new UpdateFormDirty({ path: "brand.manageBrandForm", dirty: false }),
          new Remove( BrandState, id ),
        ])),
        finalize(() => this.toggleLoading( false )),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this.store.dispatch( new SetLoading(BrandState, isLoading) );
  }
}
