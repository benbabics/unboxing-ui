import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Action, Selector } from '@ngxs/store';
import { StateContext, Store } from '@ngxs/store';
import { defaultEntityState, EntityStateModel, EntityState, IdStrategy, Add, Update, SetLoading, SetActive, CreateOrReplace } from '@ngxs-labs/entity-state';
import { find, get } from 'lodash';
import { tap } from 'rxjs/operators';
import { Slide } from './slide.action';
import { ProjectState } from '../project/project.state';

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
    return ({ slide }) => {
      const slides: Slide[] = Object.values(slide.entities);
      return find(slides, { templateId });
    }
  }
  
  get associations(): { projectId: string } {
    const getId = selector =>
      get(this.store.selectSnapshot(selector), 'id');
    
    return {
      projectId: getId(ProjectState.activeId),
    };
  }
  
  constructor(
    private store: Store,
    private http: HttpClient,
  ) {
    super(SlideState, 'id', IdStrategy.EntityIdGenerator);
  }

  @Action(Slide.Index)
  crudIndex(ctx: StateContext<SlideStateModel>) {
    this.toggleLoading(true);

    // temporary until real API
    const { projectId } = this.associations;
    return this.http.get<Slide[]>(`/api/projects/${projectId}/slides`)
      .pipe(
        tap(slides => this.store.dispatch(new CreateOrReplace(SlideState, slides))),
        tap(() => this.toggleLoading(false)),
      );
  }

  private toggleLoading(isLoading: boolean): void {
    this.store.dispatch(new SetLoading(SlideState, isLoading));
  }
}
