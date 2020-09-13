import { Component, Input, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'brand-list',
  template: `
    <ng-container *ngFor="let id of ids">
      <brand-detail [id]="id">
        <ng-template let-brand>
          <ng-template
            [ngTemplateOutlet]="templateRef"
            [ngTemplateOutletContext]="{ $implicit: brand }">
          </ng-template>
        </ng-template>
      </brand-detail>
    </ng-container>
  `
})
export class BrandListComponent {

  @Input() ids: string[] = [];
  @ContentChild( TemplateRef ) templateRef: TemplateRef<any>;
}
