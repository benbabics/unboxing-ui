export interface BrandEmail {
  email: string;
  label: string;
}
export interface BrandNetwork {
  network: 'facebook' | 'instagram' | 'twitter' | 'vimeo' | 'youtube';
  label: string;
  url: string;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  emails: BrandEmail[];
  networks: BrandNetwork[];

  accountId?: string;
}

export namespace Brand {
  
  export class Index {
    static readonly type = '[Brand API] Index';
  }
  
  export class Create {
    static readonly type = '[Brand API] Create';
    constructor( public payload: Brand ) { }
  }

  export class Update {
    static readonly type = '[Brand API] Update';
    constructor( public payload: Brand ) { }
  }

  export class Destroy {
    static readonly type = '[Brand API] Destroy';
    constructor( public id: string ) { }
  }
}
