import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Subject, Subscription, zip } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

export type TemplateField = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
};
export type Attributes = { [key: string]: any };
export type FormField = { [key: string]: AbstractControl };

@Component({
  selector: 'editor-form-inspector',
  template: ''
})
export class FormEditorInspectorComponent {

  protected _destroy$ = new Subject();
  
  protected _attributes: Attributes = {};
  protected _templateFields: TemplateField[] = [];

  protected _valueChanges$: Subscription;

  protected _templateFields$ = new Subject();
  protected _attributes$ = new Subject();

  formFields: FormField;
  form: FormGroup = new FormGroup({});

  @Input() 
  formTemplate: TemplateRef<any>;

  @Input()
  set templateFields(fields: TemplateField[]) {
    this._templateFields = fields;
    this._templateFields$.next( fields );
  }
  get templateFields(): TemplateField[] {
    return this._templateFields;
  }

  @Input()
  set attributes(attributes: Attributes) {
    this._attributes = attributes;
    this._attributes$.next( attributes );
  }
  get attributes(): Attributes {
    return this._attributes;
  }

  @Output() 
  onAttributesUpdate = new EventEmitter<any>();

  constructor() {
    zip( this._attributes$, this._templateFields$ )
    .pipe( takeUntil(this._destroy$) )
    .subscribe(() => this.buildForm());
  }

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  protected buildForm(): void {
    const reducer = (attrs, { id }) =>
      ({ ...attrs, [ id ]: new FormControl( attrs[ id ] ) });

    this.formFields = this.templateFields.reduce( reducer, this.attributes );
    this.form = new FormGroup( this.formFields );

    this.assignSlideChangeListener();
  }

  protected assignSlideChangeListener(): void {
    this._valueChanges$ && this._valueChanges$.unsubscribe();
    this._valueChanges$ = this.form.valueChanges
      .pipe(tap(attributes => this.updateAttributes( attributes )))
      .subscribe()
  }

  protected updateAttributes(attributes: Attributes): void {
    this.onAttributesUpdate.emit( attributes );
  }
}