import { LogService, EnumWalletLogType, reviewType } from './../app-service/log.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LangService, lang } from './../app-service/lang.service';
import { DayjsService, timeFormat } from './../app-service/dayjs.service';

export enum Tabs {
  review,
  WALLET,
  TRANSFER
}

// export enum reviewType {
//   deposit = 'deposit',
//   withdraw = 'withdraw'
// }

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  // styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements OnInit {

  Tabs = Tabs;

  @Input() tab;
  @Input() options;
  @Output() queryEvt = new EventEmitter<any>();
  @Output() changeEvt = new EventEmitter();


  locale = 'zh';
  // form;
  daterangepicker = new FormControl('');
  optionsCtrl = new FormControl();

  constructor(
    private langService: LangService,
    private logService: LogService,
  ) {
    this.optionsCtrl.valueChanges.subscribe((val) => {

      // console.log('valueChanges val', val);
      this.changeEvt.emit();
    });

    this.langService.onloadSub
      .subscribe((boo) => {

        if (boo) {
          this.locale = this.langService.getLocaleForDatePicker();
        }

      });
  }

  ngOnInit(): void {
    switch (this.tab) {
      case Tabs.review:

        // console.log('logService.type', this.logService.type);

        if (this.logService.type) {
          switch (this.logService.type) {
            case reviewType.deposit:
              this.optionsCtrl.patchValue(reviewType.deposit);
              break;

            case reviewType.withdraw:
              this.optionsCtrl.patchValue(reviewType.withdraw);
              break;

            case reviewType.activityWallet:
              this.optionsCtrl.patchValue(reviewType.activityWallet);
              break;

          }
          // console.log(this.optionsCtrl);
        } else {

          this.optionsCtrl.patchValue(this.options[0].value);

        }


        break;

      case Tabs.WALLET:

        // console.log('options', this.options);

        this.options.forEach((item) => {

          item.label = item.name;
          item.value = item.id;

        });

        this.optionsCtrl.patchValue('all');

        break;

      case Tabs.TRANSFER:

        console.log('logService.type', this.logService.type);
        this.optionsCtrl.patchValue(this.options[0].value);

        // if (this.logService.type === reviewType.transfer) {

        //   this.optionsCtrl.patchValue(EnumWalletLogType['transfer-game']);
        //   this.logService.depositAndWithdrawLog(reviewType.deposit);
        // }

        // this.optionsCtrl.patchValue('all');

        break;

    }


  }

  query(): void {

    // console.log(this.optionsCtrl.value);

    const formdata: any = {};

    const period = this.daterangepicker.value;

    formdata.startTime = DayjsService.getDayjsObj(period[0], timeFormat);
    formdata.endTime = DayjsService.getDayjsObj(period[1], timeFormat);

    switch (this.tab) {
      case Tabs.review:

        formdata.reviewType = this.optionsCtrl.value;

        break;

      case Tabs.WALLET:

        formdata.platformId = this.optionsCtrl.value;

        break;

      case Tabs.TRANSFER:


        formdata.type = this.optionsCtrl.value;

        break;

    }

    // console.log('formdata', formdata);

    this.queryEvt.emit(formdata);

  }

  setTime(evt): void {

    this.daterangepicker.patchValue([
      new Date(evt.start),
      new Date(evt.end)
    ]);

  }

}
