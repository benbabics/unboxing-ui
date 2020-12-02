import { Project } from '../project.action';
import { AssetDirectory } from './asset-directory';
import { AssetElement } from './asset-element';
import { Slide } from './slide';

export interface ProjectAssociations {
  themeId: string;
  assetElements: AssetElement[];
  assetDirectories: AssetDirectory[];
  slides: Slide[];
}

export interface ProjectActive {
  projectId: string;
  project: Project;
}

export namespace ProjectActive {

  export class SetLoading {
    static readonly type = '[ProjectActive] SetLoading';
    constructor( public isLoading: boolean ) { }
  }

  export class SetVisibilityStatus {
    static readonly type = '[ProjectActive] SetVisibilityStatus';
    constructor( public published: boolean ) { }
  }
  
  export class SetAssociations {
    static readonly type = '[ProjectActive] SetAssociations';
    constructor( public payload: ProjectAssociations ) { }
  }

  export class ClearAssociations {
    static readonly type = '[ProjectActive] ClearAssociations';
  }

  export class SaveAssociatedSlides {
    static readonly type = '[ProjectActive] SaveAssociatedSlides';
  }
}
