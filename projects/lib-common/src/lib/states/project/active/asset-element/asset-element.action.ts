export enum AssetElementFormat {
  All   = "ALL",
  Photo = "PHOTO",
  Video = "VIDEO",
}

export interface AssetElement {
  id: string;
  url: string;
  name: string;
  format: AssetElementFormat;

  // relationships
  projectId: string;
  assetDirectoryId: string;
}

export namespace AssetElement {
  export class Index {
    static readonly type = '[AssetElement API] Index';
    constructor(public projectId: string) { }
  }

  export class Create {
    static readonly type = '[AssetElement API] Create';
    constructor(public payload: AssetElement) { }
  }

  export class Update {
    static readonly type = '[AssetElement API] Update';
    constructor(public payload: Partial<AssetElement>) { }
  }

  export class Destroy {
    static readonly type = '[AssetElement API] Destroy';
    constructor(public id: string) { }
  }
}
