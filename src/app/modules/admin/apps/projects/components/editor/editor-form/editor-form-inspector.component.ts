import { Component, Input, Output, EventEmitter, TemplateRef, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Subject, Subscription, zip } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

export type TemplateField = {
  id: string;
  type: string;
  label?: string;
  placeholder?: string;
  divider?: boolean;
  subtext?: string;
  icon?: string;
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

  formFields: FormField;
  form: FormGroup = new FormGroup({});

  @Input() 
  formTemplate: TemplateRef<any>;

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
  }
  get attributes(): Attributes {
    return this._attributes;
  }

  @Output() 
  onAttributesUpdate = new EventEmitter<any>();

  ngOnDestroy() {
    this._destroy$.next( true );
    this._destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.buildForm();
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
