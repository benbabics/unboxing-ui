import { AssetElement } from './../asset-element/asset-element.action';
import { AssetDirectory } from './../asset-directory/asset-directory.action';
import { Asset } from './../asset/asset.action';
import { Account } from '../account/account.action';
import { Brand } from '../brand/brand.action';
import { Slide } from '../slide/slide.action';

export interface Project {
  id: string;
  slug: string;
  title: string;

  // relationships
  accountId: string;
  brandId: string;
  themeId: string;

  // side loaded data
  assets: Asset[];
  assetDirectories: AssetDirectory[];
  assetElements: AssetElement[];
  account: Account;
  brand: Brand;
  slides: Slide[];
}

export namespace Project {
  export class Manage {
    static readonly type = '[Project Form] Manage';
    constructor(public payload?: Project) { }
  }

  export class Show {
    static readonly type = '[Project API] Show';
    constructor(public slug: string) { }
  }
  
  export class Create {
    static readonly type = '[Project API] Create';
    constructor(public payload: Project) { }
  }

  export class Update {
    static readonly type = '[Project API] Update';
    constructor(public payload: Project) { }
  }
}
