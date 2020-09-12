export interface SearchProject {
  loading: boolean;
}

export namespace SearchProject {
  
  export class SetLoading {
    static readonly type = '[SearchProject] SetLoading';
    constructor( public loading: boolean ) { }
  }

  export class ResetFilters {
    static readonly type = '[SearchProject] ResetFilters';
  }

  export class Search {
    static readonly type = '[SearchProject API] Search';
    constructor( public payload: any ) { }
  }
}
