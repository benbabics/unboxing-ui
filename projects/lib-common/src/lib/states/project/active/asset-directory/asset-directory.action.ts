export interface AssetDirectory {
  id: string;
  name: string;
  path?: string;

  // relationships
  projectId: string;
  parentId?: string;
}

export namespace AssetDirectory {
  export class Index {
    static readonly type = '[AssetDirectory API] Index';
    constructor(public projectId: string) { }
  }

  export class Create {
    static readonly type = '[AssetDirectory API] Create';
    constructor(public payload: Partial<AssetDirectory>) { }
  }

  export class Update {
    static readonly type = '[AssetDirectory API] Update';
    constructor(public payload: Partial<AssetDirectory>) { }
  }

  export class Destroy {
    static readonly type = '[AssetDirectory API] Destroy';
    constructor(public id: string) { }
  }
}
