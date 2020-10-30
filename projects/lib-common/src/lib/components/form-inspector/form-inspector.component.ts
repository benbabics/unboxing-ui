import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

export type TemplateField = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
};
export type Attributes = { [key: string]: any };
export type FormField = { [key: string]: AbstractControl };

@Component({
  selector: 'lib-form-inspector',
  template: ''
})
export class FormInspectorComponent {

  protected _attributes: Attributes = {};
  protected _templateFields: TemplateField[] = [];

  protected _valueChanges$: Subscription;

  formFields: FormField;
  form: FormGroup = new FormGroup({});

  @Input() formTemplate: TemplateRef<any>;

  @Input()
  set templateFields(fields: TemplateField[]) {
    this._templateFields = fields;
  }
  get templateFields(): TemplateField[] {
    return this._templateFields;
  }

  @Input()
  set attributes(attributes: Attributes) {
    this._attributes = attributes;
    this.buildForm();
  }
  get attributes(): Attributes {
    return this._attributes;
  }

  @Output() onAttributesUpdate = new EventEmitter<any>();

  protected buildForm(): void {
    const reducer = (attrs, { id }) =>
      ({ ...attrs, [id]: new FormControl(attrs[id]) });

    this.formFields = this.templateFields.reduce(reducer, this.attributes);
    this.form = new FormGroup(this.formFields);

    this.assignSlideChangeListener();
  }

  protected assignSlideChangeListener(): void {
    this._valueChanges$ && this._valueChanges$.unsubscribe();
    this._valueChanges$ = this.form.valueChanges
      .pipe(tap(attributes => this.updateAttributes(attributes)))
      .subscribe()
  }

  protected updateAttributes(attributes: Attributes): void {
    this.onAttributesUpdate.emit(attributes);
  }
}
