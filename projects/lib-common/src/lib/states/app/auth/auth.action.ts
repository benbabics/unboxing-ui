export interface Auth {
  token: string;
  email: string;
  rememberMe: boolean;
}

export namespace Auth {

  export class Login {
    static readonly type = '[Auth] Login';
    constructor( public payload: { email: string, password: string, rememberMe: boolean } ) { }
  }
  
  export class Logout {
    static readonly type = '[Auth] Logout';
  }
}
