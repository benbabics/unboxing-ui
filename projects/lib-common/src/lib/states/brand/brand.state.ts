import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, State, Action, Selector, StateContext } from '@ngxs/store';
import { defaultEntityState, EntityStateModel, EntityState, IdStrategy, Add, Update, SetLoading, Remove, CreateOrReplace } from '@ngxs-labs/entity-state';
import { UpdateFormDirty } from '@ngxs/form-plugin';
import { finalize, flatMap, tap } from 'rxjs/operators';
import { compact, sortBy } from 'lodash';
import { Brand } from './brand.action';

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

  @Selector()
  static id(id: string) {
    return ({ brand }) => {
      return brand.entities[ id ];
    }
  }
  
  @Selector()
  static ids(...args: string[]) {
    return ({ brand }) => {
      const brands = [ ...args ].map(id => brand.entities[ id ]);
      return compact( brands );
    }
  }

  @Selector()
  static sortedEntities(state: BrandStateModel) {
    return sortBy( state.entities, [ 'name' ] );
  }

  constructor(
    private _store: Store,
    private _http: HttpClient,
  ) {
    super( BrandState, 'id', IdStrategy.EntityIdGenerator );
  }

  @Action( Brand.Index )
  crudIndex(ctx: StateContext<BrandStateModel>) {
    this._toggleLoading( true );

    return this._http.get<Brand[]>( `/api/brands` )
      .pipe(
        tap(memberships => ctx.dispatch( new CreateOrReplace(BrandState, memberships) )),
        tap(() => this._toggleLoading( false )),
      );
  }

  @Action( Brand.Create )
  crudCreate(ctx: StateContext<BrandStateModel>, { payload }: Brand.Create) {
    this._toggleLoading( true );
    
    return this._http.post<Brand>( `/api/accounts/${ payload.accountId }/brands`, payload )
      .pipe(
        flatMap(brand => ctx.dispatch([
          new UpdateFormDirty({ path: "brand.manageBrandForm", dirty: false }),
          new Add( BrandState, brand ),
        ])),
        finalize(() => this._toggleLoading( false )),
      );
  }

  @Action( Brand.Update )
  crudUpdate(ctx: StateContext<BrandStateModel>, { payload }: Brand.Update) {
    this._toggleLoading( true );

    return this._http.patch<Brand>( `/api/brands/${ payload.id }`, payload )
      .pipe(
        flatMap(brand => ctx.dispatch([
          new UpdateFormDirty({ path: "brand.manageBrandForm", dirty: false }),
          new Update( BrandState, brand.id, brand ),
        ])),
        finalize(() => this._toggleLoading( false )),
      );
  }

  @Action( Brand.Destroy )
  crudDestroy(ctx: StateContext<BrandStateModel>, { id }: Brand.Destroy) {
    this._toggleLoading( true );

    return this._http.delete( `/api/brands/${ id }` )
      .pipe(
        flatMap(()  => ctx.dispatch([
          new UpdateFormDirty({ path: "brand.manageBrandForm", dirty: false }),
          new Remove( BrandState, id ),
        ])),
        finalize(() => this._toggleLoading( false )),
      );
  }

  private _toggleLoading(isLoading: boolean): void {
    this._store.dispatch( new SetLoading(BrandState, isLoading) );
  }
}
