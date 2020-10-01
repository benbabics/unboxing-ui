export interface ActiveProjectSearch {
  loading: boolean;
  filters: any;
  results: any[];
}

export namespace ActiveProjectSearch {
  
  export class SetLoading {
    static readonly type = '[ActiveProjectSearch] SetLoading';
    constructor( public loading: boolean ) { }
  }

  export class SetFilters {
    static readonly type = '[ActiveProjectSearch] SetFilters';
    constructor( public payload: any ) { }
  }

  export class ResetFilters {
    static readonly type = '[ActiveProjectSearch] ResetFilters';
  }

  export class Search {
    static readonly type = '[ActiveProjectSearch API] Search';
    constructor( public payload: any ) { }
  }
}
