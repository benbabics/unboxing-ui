export interface Slide {
  id: string;
  attributes: any;

  // view properties
  isActive?;
  title?
  
  // relationships
  projectId: string;
  themeId: string;
  templateId: string;
}

export namespace Slide {
  export class Index {
    static readonly type = '[Slide API] Index';
  }

  export class Show {
    static readonly type = '[Slide API] Show';
    constructor( public id: string ) { }
  }

  export class Create {
    static readonly type = '[Slide API] Create';
    constructor( public payload: Slide ) { }
  }

  export class Update {
    static readonly type = '[Slide API] Update';
    constructor( public payload: Slide ) { }
  }

  export class Destroy {
    static readonly type = '[Slide API] Destroy';
    constructor( public id: string ) { }
  }

  export class FocusElement {
    static readonly type = '[Slide] FocusElement';
    constructor( public name: string ) { }
  }

  export class FocusField {
    static readonly type = '[Slide] FocusField';
    constructor(public name: string) { }
  }
}
