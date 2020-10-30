import { AssetElement, AssetDirectory, Slide } from './active';
import { Brand } from '../brand/brand.action';

export interface Project {
  id: string;
  slug: string;
  title: string;
  date: Date;

  // relationships
  accountId: string;
  brandId: string;
  themeId: string;

  // side loaded data
  assetDirectories: AssetDirectory[];
  assetElements: AssetElement[];
  brand: Brand;
  slides: Slide[];
}

export namespace Project {
  export class Manage {
    static readonly type = '[Project Form] Manage';
    constructor( public payload?: Project ) { }
  }

  export class Show {
    static readonly type = '[Project API] Show';
    constructor( public id: string ) { }
  }
  
  export class Create {
    static readonly type = '[Project API] Create';
    constructor( public payload: Project ) { }
  }

  export class Update {
    static readonly type = '[Project API] Update';
    constructor( public payload: Project ) { }
  }
}
