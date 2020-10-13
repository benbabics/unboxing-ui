export interface App {
  isLoading: boolean;
}

export namespace App {

  export class Start {
    static readonly type = '[App] Start';
  }

  export class SetLoading {
    static readonly type = '[App] SetLoading';
    constructor(public isLoading: boolean) { }
  }
}
