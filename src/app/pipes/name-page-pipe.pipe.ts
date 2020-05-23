import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'namePagePipe'
})
export class NamePagePipePipe implements PipeTransform {

  transform(value: any): string {
    value = value.split('/');
    return value[2];
  }

}
