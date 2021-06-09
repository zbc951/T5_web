import { Subject, pipe, BehaviorSubject } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

export enum lang {
  zhHans = 'zh-Hans',
  zhHant = 'zh-Hant',
  en = 'en',
  jp = 'jp'
}

@Injectable({
  providedIn: 'root',
})
export class LangService {

  lang_now;
  translations;
  onloadSub = new BehaviorSubject(false);

  constructor(
    private translate: TranslateService
  ) {

    this.translate.onLangChange.subscribe((evt: LangChangeEvent) => {

      console.log('onLangChange');
      this.lang_now = evt.lang;
      const { translations } = evt;
      this.setTxt(translations);
    });
  }

  setTxt(translations): void {
    this.translations = translations;
    this.onloadSub.next(true);
    console.log('lang.service ready');
  }

  getLocaleForDatePicker(): string {

    let locale = 'zh';

    switch (this.lang_now) {
      case lang.zhHant:
      case lang.zhHans:
        locale = 'zh';
        break;
      case lang.en:
        locale = 'en';
        break;
      case lang.jp:
        locale = 'ja';
        break;

    }

    return locale;

  }

}
