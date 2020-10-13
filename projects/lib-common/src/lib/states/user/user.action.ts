export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  avatar?: string;
}

export namespace User {

  export class SearchQuery {
    static readonly type = '[User API] SearchQuery';
    constructor( public query: string ) { }
  }

  export class SearchResults {
    static readonly type = '[User API] SearchResults';
    constructor( public payload: User[] ) { }
  }
}
