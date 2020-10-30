import { AssetElementFormat } from '../asset-element';

export interface ThemeTemplateField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  templateId?: string;
  bindingId?: string;
  entityType?: AssetElementFormat;
  fields?: ThemeTemplateField[];
}

export interface ThemeTemplate {
  id: string;
  title: string;
  fields: ThemeTemplateField[];
}

export interface Theme {
  id: string;
  slug: string;
  name: string;
  templates: ThemeTemplate[];
}

export namespace Theme {
  export class Index {
    static readonly type = '[Theme API] Index';
  }
}
