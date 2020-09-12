import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagIcon'
})
export class TagIconPipe implements PipeTransform {

  transform(value: string): string {
    switch( value ) {
      case "brand.id":      return "heroicons_outline:speakerphone";
      case "project.title": return "title";
      case "project.slug":  return "language";
    }
  }
}
