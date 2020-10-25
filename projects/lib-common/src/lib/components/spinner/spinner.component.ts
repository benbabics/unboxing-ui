import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {

  @Input() size: string = "50";
  @Input() strokeWidth: string = "2";
  @Input() strokeColor: string = "black";
}
