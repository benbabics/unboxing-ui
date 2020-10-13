import { AssetFormat } from './../asset/asset.action';

export interface ThemeTemplateField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  templateId?: string;
  bindingId?: string;
  entityType?: AssetFormat;
  fields?: ThemeTemplateField[];
}

export interface ThemeTemplate {
  id: string;
  title: string;
  fields: ThemeTemplateField[];
}

export interface Theme {
  id: string;
  name: string;
  templates: ThemeTemplate[];
}

export namespace Theme {
  export class Index {
    static readonly type = '[Theme API] Index';
  }

  export class Show {
    static readonly type = '[Theme API] Show';
    constructor(public id: string) { }
  }
}
