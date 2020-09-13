import { Project } from '../../../../../../../../projects/lib-common/src/public-api';

export interface ProjectSearch {
  loading: boolean;
  filters: any;
  results: Project[];
}

export namespace ProjectSearch {
  
  export class SetLoading {
    static readonly type = '[ProjectSearch] SetLoading';
    constructor( public loading: boolean ) { }
  }

  export class SetFilters {
    static readonly type = '[ProjectSearch] SetFilters';
    constructor( public payload: any ) { }
  }

  export class ResetFilters {
    static readonly type = '[ProjectSearch] ResetFilters';
  }

  export class Search {
    static readonly type = '[ProjectSearch API] Search';
    constructor( public payload: any ) { }
  }
}
