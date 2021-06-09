import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LangService } from './../app-service/lang.service';
import { LogService } from './../app-service/log.service';
import { ReviewService, EnumTranslateStatus } from './../app-service/review.service';
import { DayjsService, timeFormat } from './../app-service/dayjs.service';
import { AppRoutes } from './../constant/routes';

enum walletType {
  deposit = 'deposit-bank',
  withdraw = 'withdraw',
  transfer = 'transfer',
  thirdDeposit = 'third-party-deposit'
}

enum urlType {
  deposit = 'deposit',
  withdraw = 'withdraw',
  transfer = 'transfer',
}



export enum periodType {
  yesterday,
  today,
  week,
  twoWeek,
  twoMonth
}

@Component({
  selector: 'app-small-record',
  templateUrl: './small-record.component.html',
  // styleUrls: ['./small-record.component.scss']
})
export class SmallRecordComponent implements OnInit {
  @Input() type: string;
  text = {
    title: '',
    listTitle: ''
  };

  CENTER_WALLET_TEXT = '';

  translations;
  record = [];
  urlType = urlType;
  walletType = walletType;
  Number = Number;

  constructor(
    private router: Router,
    private langService: LangService,
    private reviewService: ReviewService,
    private logService: LogService,
  ) {

  }

  ngOnInit(): void {
    // console.log('type', this.type);
    this.langService.onloadSub
      .subscribe((boo) => {

        if (boo) {
          this.setTxt(this.langService.translations, this.type);
        }
      });

    let data = {
      startTime: '',
      endTime: '',
      type: []
    };
    data.startTime = DayjsService.getPeriodTime(periodType.twoMonth).start;
    data.endTime = DayjsService.getPeriodTime(periodType.twoMonth).end;

    switch (this.type) {
      case urlType.deposit:
        // let url = `?type[]=${walletType.deposit}&type[]=${walletType.thirdDeposit}&startTime=${data.startTime}&endTime=${data.endTime}`;
        data.type = [walletType.deposit, walletType.thirdDeposit];
        this.logService.walletLogType(data)
          .subscribe((res: any) => {
            console.log(res);
            let data = res.data.content.slice(0, 4);
            data.forEach((item) => {
              this.record.push({ amount: item.changeMoney, type: item.type });
            });
            // console.log('re', this.record);
          });


        break;

      case urlType.withdraw:
        // let url2 = `?type[]=${walletType.withdraw}&startTime=${data.startTime}&endTime=${data.endTime}`;
        data.type = [walletType.withdraw];
        this.logService.walletLogType(data)
          .subscribe((res: any) => {
            // console.log('res', res);

            let data = res.data.content.slice(0, 4);
            data.forEach((item) => {
              this.record.push({ amount: -item.changeMoney });
            });

          });
        break;


      case urlType.transfer:

        // this.record = this.fakeRecord;
        let formdata = {
          startTime: '',
          endTime: '',
          type: ['transfer-game', 'transfer-wallet']
        };

        formdata.startTime = DayjsService.getPeriodTime(periodType.twoMonth).start;
        formdata.endTime = DayjsService.getPeriodTime(periodType.twoMonth).end;

        this.logService.walletLog(formdata)
          .subscribe((res: any) => {

            // console.log('walletLog res', res);
            let data = res.data.content.slice(0, 4);
            data.forEach((item) => {
              this.record.push(
                {
                  // wallet: '中心錢包',
                  wallet: this.CENTER_WALLET_TEXT,
                  amount: Math.abs(item.changeMoney),
                  platform: item.gamePlatformName,
                  type: item.type

                }
              );
            });

            // console.log('record', this.record);

          });

        break;

      default:
        break;
    }
  }

  setTxt(translations: any, type: string): void {
    this.translations = translations;

    this.CENTER_WALLET_TEXT = this.translations.PFTRANSITION.CENTER;

    switch (type) {
      case 'transfer':
        this.text.title = this.langService.translations.SMALLBOARD.TITLE.TRANSFER;
        this.text.listTitle = this.langService.translations.SMALLBOARD.TRANSFER;
        break;
      case 'withdraw':
        this.text.title = this.langService.translations.SMALLBOARD.TITLE.WITHDRAW;
        this.text.listTitle = this.langService.translations.SMALLBOARD.WITHDRAW;
        break;
      case 'deposit':
        this.text.title = this.langService.translations.SMALLBOARD.TITLE.DEPOSIT;
        this.text.listTitle = this.langService.translations.SMALLBOARD.DEPOSIT;
        break;
    }
  }

  more(): void {


    // switch (this.type) {
    //   case urlType.deposit:
    //     this.logService.depositAndWithdrawLog(urlType.deposit);
    //     break;
    //   case urlType.withdraw:
    //     this.logService.depositAndWithdrawLog(urlType.withdraw);
    //     break;
    // }

    this.logService.depositAndWithdrawLog(this.type);

    this.router.navigateByUrl(AppRoutes.REVIEW_MAIN);
  }

}
