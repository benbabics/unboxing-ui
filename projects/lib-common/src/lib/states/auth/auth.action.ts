export namespace Auth {
  export class Login {
    static readonly type = '[Auth] Login';

    constructor(
      public payload: { email: string, password: string },
    ) { }
  }
  
  export class Logout {
    static readonly type = '[Auth] Logout';
  }
}
