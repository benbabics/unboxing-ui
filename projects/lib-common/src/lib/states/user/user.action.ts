export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  avatar?: string;
}

export namespace User {

  export class Query {
    static readonly type = '[User API] Query';
    constructor( public query: string ) { }
  }
}
