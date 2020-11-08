import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Action, Selector } from '@ngxs/store';
import { StateContext, Store } from '@ngxs/store';
import { defaultEntityState, EntityStateModel, EntityState, IdStrategy, Add, Update, SetLoading, SetActive, CreateOrReplace } from '@ngxs-labs/entity-state';
import { find, get } from 'lodash';
import { tap } from 'rxjs/operators';
import { Slide } from './slide.action';
import { ProjectState } from '../../project.state';

export interface SlideStateModel extends EntityStateModel<Slide> {
}

@State({
  name: 'slide',
  defaults: defaultEntityState()
})
@Injectable()
export class SlideState extends EntityState<Slide> {

  @Selector()
  static getByTemplateId(templateId: string) {
    return state => {
      const entities = state.project.projectActive.slide.entities;
      const slides: Slide[] = Object.values( entities );
      return find( slides, { templateId } );
    }
  }
  
  get associations(): { projectId: string } {
    const getId = selector =>
      get( this._store.selectSnapshot(selector), 'id' );
    
    return {
      projectId: getId( ProjectState.activeId ),
    };
  }
  
  constructor(
    private _store: Store,
    private _http: HttpClient,
  ) {
    super( SlideState, 'id', IdStrategy.EntityIdGenerator );
  }

  @Action( Slide.Index )
  crudIndex(ctx: StateContext<SlideStateModel>) {
    this._toggleLoading( true );

    // temporary until real API
    const { projectId } = this.associations;
    return this._http.get<Slide[]>( `/api/projects/${projectId}/slides` )
      .pipe(
        tap(slides => this._store.dispatch( new CreateOrReplace(SlideState, slides) )),
        tap(() => this._toggleLoading( false )),
      );
  }

  private _toggleLoading(isLoading: boolean): void {
    this._store.dispatch( new SetLoading(SlideState, isLoading) );
  }
}
