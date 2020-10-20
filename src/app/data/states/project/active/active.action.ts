import { Project } from '../project.action';
import { AssetDirectory } from './asset-directory';
import { AssetElement } from './asset-element';
import { Slide } from './slide';

export interface ProjectAssociations {
  assetElements: AssetElement[];
  assetDirectories: AssetDirectory[];
  slides: Slide[];
}

export interface ProjectActive {
  projectId: string;
  project: Project;
}

export namespace ProjectActive {

  export class SetAssociations {
    static readonly type = '[ProjectActive] SetAssociations';
    constructor( public payload: ProjectAssociations ) { }
  }

  export class ClearAssociations {
    static readonly type = '[ProjectActive] ClearAssociations';
  }
}
