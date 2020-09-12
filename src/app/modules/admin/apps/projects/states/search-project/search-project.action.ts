import { Project } from '../../../../../../../../projects/lib-common/src/public-api';

export interface SearchProject {
  loading: boolean;
  filters: any;
  results: Project[];
}

export namespace SearchProject {
  
  export class SetLoading {
    static readonly type = '[SearchProject] SetLoading';
    constructor( public loading: boolean ) { }
  }

  export class SetFilters {
    static readonly type = '[SearchProject] SetFilters';
    constructor( public payload: any ) { }
  }

  export class ResetFilters {
    static readonly type = '[SearchProject] ResetFilters';
  }

  export class Search {
    static readonly type = '[SearchProject API] Search';
    constructor( public payload: any ) { }
  }
}
