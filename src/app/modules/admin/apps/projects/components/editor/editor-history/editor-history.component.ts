import { Component } from '@angular/core';
import { EditorChangeHistoryService } from '../../../services';

@Component({
  selector: 'editor-history',
  templateUrl: './editor-history.component.html',
  styleUrls: ['./editor-history.component.scss']
})
export class EditorHistoryComponent {

  get canUndo(): boolean {
    return this.history.changes.hasPrevious;
  }

  get canRedo(): boolean {
    return this.history.changes.hasNext;
  }

  constructor(
    public history: EditorChangeHistoryService,
  ) { }

  handleUndo(): void {
    this.history.undo();
  }

  handleRedo(): void {
    this.history.redo();
  }
}
