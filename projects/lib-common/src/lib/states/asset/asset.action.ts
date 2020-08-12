export enum AssetFormat {
  All   = "ALL",
  Photo = "PHOTO",
  Video = "VIDEO",
}

export interface Asset {
  id: string;
  path: string;
  url: string;
  format: AssetFormat;

  // relationships
  projectId: string;
}

export interface FileElement {
  id: string;
  name: string;
  isFolder: boolean;
  parentId: string;
  assetId: string;
  isSelected?: boolean;
}

export namespace Asset {
  export class Index {
    static readonly type = '[Asset API] Index';
    constructor(public projectId: string) { }
  }

  export class Create {
    static readonly type = '[Asset API] Create';
    constructor(public payload: Asset) { }
  }
  
  export class Show {
    static readonly type = '[Asset API] Show';
    constructor(public id: string) { }
  }

  export class Update {
    static readonly type = '[Asset API] Update';
    constructor(public payload: Asset) { }
  }

  export class Destroy {
    static readonly type = '[Asset API] Destroy';
    constructor(public id: string) { }
  }

  export class ClearActiveFile {
    static readonly type = '[Asset] Clear Active File';
  }

  export class SetActiveFile {
    static readonly type = '[Asset] Set Active File';
    constructor(public id: string) { }
  }

  export class TransformAsFile {
    static readonly type = '[Asset] Transform as File';
    constructor(public payload: Asset) { }
  }
  
  export class TransformAsFiles {
    static readonly type = '[Asset] Transform as Files';
    constructor(public payload: Asset[]) { }
  }
}
