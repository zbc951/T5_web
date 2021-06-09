import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  static getHttpParams(obj: any) {

    // console.log('getHttpParams', obj);

    let params = new HttpParams();

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key];
        if (element !== undefined && element != null) {

          if (element instanceof Array) {

            element.forEach((item) => {
              params = params.append(`${key.toString()}[]`, item);
            });

          } else {

            params = params.append(key, element);
          }

        }
      }
    }

    // console.log('***', params);

    return params;

  }


  static contactErrMsg(errors): string {

    let msg = '';

    for (const p of Object.keys(errors)) {

      const t = errors[p];

      if (Array.isArray(t)) {

        const tmp = t.join(' ');
        msg += tmp;

      } else if (typeof errors[p] == 'string') {

        msg += errors[p];
      }

    }

    return msg;
  }

  static chunk(array, size = 1): any[] {

    let arrayChunks = [];

    for (let i = 0; i < array.length; i += size) {
      let arrayChunk = array.slice(i, i + size);
      arrayChunks.push(arrayChunk);
    }

    return arrayChunks;

  }

  static toTop(): void {
    window.scroll(0, 0);
  }

  static getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

}
