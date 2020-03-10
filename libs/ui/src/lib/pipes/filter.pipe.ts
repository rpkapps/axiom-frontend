import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uiFilter'
})
export class UiFilterPipe implements PipeTransform {

  transform(array: any[], filter: any) {
    const regex = new RegExp(filter, 'gi');
    return array?.filter(item => {
      if (typeof item === 'string') {
        return item.match(regex);
      } else {
        return item.toString().match(regex);
      }
    }) || [];
  }

}
