import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], args: any[]): any {
    var key = args[0];
    var value = args[1];
    var empty: any [];

    var keys = key.split('.');
    var temp: any [];
    var result: any [] = [];

    if(keys.length == 1)
    {
      return value
      ? items.filter(item => item[key] == value)
      : empty;
    }

    items.forEach(item => {
      keys.forEach((key, index) => {
        if (index == keys.length - 1) {
          if(temp[key] == value)
          {
            result.push(item);
          }
        }else {
          temp = item[key];
        }
      });
    });

    return result;
  }
}
