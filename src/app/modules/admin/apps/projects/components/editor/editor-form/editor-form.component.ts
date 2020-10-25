import { Component } from '@angular/core';
import { set } from 'lodash';
import { FormEditorInspectorComponent } from './editor-form-inspector.component';

@Component({
  selector: 'editor-form',
  templateUrl: './editor-form.component.html',
  styleUrls: ['./editor-form.component.scss']
})
export class EditorFormComponent extends FormEditorInspectorComponent {

  handleSelectedFont(fontId: string, fieldId: string): void {
    const attributes = this.attributes;
    set( attributes, fieldId, fontId );
    this.updateAttributes( attributes );
  }

  handleSortedBindingIds(bindingIds: string[], fieldId: string): void {
    console.log('* handleSortedBindingIds', bindingIds);
  }

  handleSelectedIterationAssetIds(assetIds: string[], fieldId: string): void {
    set( this.attributes, fieldId, assetIds );
    this.updateAttributes( this.attributes );
  }
}
