import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Font, FontIds, FontMap } from '@projects/lib-common/src/public-api';

@Component({
  selector: 'font-selector',
  templateUrl: './font-selector.component.html',
  styleUrls: ['./font-selector.component.scss'],
})
export class FontSelectorComponent {

  fonts: Font[] = FontIds;

  @Input() fontId: string;
  @Output() onSelection = new EventEmitter<string>();

  get selectedFont(): Font {
    return FontMap.get( this.fontId );
  }

  handleSelection(fontId?: string): void {
    this.onSelection.emit( fontId );
  }
}
