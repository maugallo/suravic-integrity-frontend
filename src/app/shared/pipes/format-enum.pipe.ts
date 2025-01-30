import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatEnum',
  standalone: true
})
export class FormatEnumPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value; 

    const formattedValue = value
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return formattedValue;
  }

}
