import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FilterObjVal',
})
export class FilterObjVal implements PipeTransform {
  transform(list: any, key: string, value: string) {
    return list.filter((item) => {
      return item[key] == value;
    });
  }
}
