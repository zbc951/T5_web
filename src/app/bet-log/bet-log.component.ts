import { ToastItem } from './../app-service/toast.service';
import { DayjsService, timeFormat } from './../app-service/dayjs.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DateSelectorComponent } from '../date-selector/date-selector.component';
import { LogService } from '../app-service/log.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PublicService } from '../app-service/public.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LangService, lang } from './../app-service/lang.service';
@Component({
  selector: 'app-bet-log',
  templateUrl: './bet-log.component.html',
  // styleUrls: ['./bet-log.component.scss']
})
export class BetLogComponent implements OnInit {

  locale = 'zh';
  pageConfig: {
    itemsPerPage,
    currentPage,
    totalItems
  } = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0,
    };

  @ViewChild(DateSelectorComponent)
  private dateSelector: DateSelectorComponent;

  form: FormGroup;
  daterangepicker = new FormControl('');

  gamePlatforms = [];
  data;

  betRecord = [];
  betDetails = [];
  betSumTotal: any = {};
  betDetailId;
  betQry: {
    platformId: number,
    // betTime: string,
    page?: number,
    startTime: string,
    endTime: string
  };
  isMoreHidden = true;

  walletOptions = [];
  isActivityWallet;

  constructor(
    private formBuilder: FormBuilder,
    private logService: LogService,
    private publicService: PublicService,
    private translate: TranslateService,
  ) {


    this.translate.onLangChange
      .subscribe((evt: LangChangeEvent) => {

        switch (evt.lang) {
          case lang.zhHant:
          case lang.zhHans:
            this.locale = 'zh';
            break;
          case lang.en:
            this.locale = 'en';
            break;
          case lang.jp:
            this.locale = 'ja';
            break;

        }

      });

    this.form = this.formBuilder.group({
      startTime: '',
      endTime: '',
      platformId: [],
      logId: 'all'
    });

  }

  ngOnInit(): void {

    this.gamePlatforms = this.publicService.platforms.platforms;
    this.form.controls.platformId.patchValue('all');

    const formdata = {
      receiveSwitch: 'all'
    };

    this.isActivityWallet = this.publicService.isActivityWallet;

    if (this.isActivityWallet) {

      this.logService.activityWalletLog(formdata).subscribe((res: any) => {
        this.walletOptions = res.data.content;
        // console.log(this.walletOptions);
      });
    }


  }

  pageChanged(event): void {

    // console.log('pageChanged', event);

    this.pageConfig.currentPage = event;
    this.queryBet();
  }

  queryBet(): void {

    this.betRecord = [];

    // console.log('queryBet');

    const period = this.daterangepicker.value;
    this.form.controls.startTime.patchValue(DayjsService.getDayjsObj(period[0], timeFormat));
    this.form.controls.endTime.patchValue(DayjsService.getDayjsObj(period[1], timeFormat));

    const formdata = Object.assign({}, this.form.value);
    formdata.page = this.pageConfig.currentPage;
    formdata.perPage = this.pageConfig.itemsPerPage;
    formdata.logId = this.form.value.logId;

    console.log('platformId', this.form.value.platformId);

    if (this.form.value.platformId == 'all') {

      formdata.platformId = this.gamePlatforms.map((item) => {
        return item.id;
      });

    } else {

      formdata.platformId = [this.form.value.platformId];

    }

    console.log(this.form, formdata);
    //test
    // formdata.startTime = '2020-07-01';
    // console.log('fomrdata', formdata);

    this.logService.perDaySumBetLog(formdata)
      .subscribe((res: any) => {

        // console.log("perDaySumBetLog res", res);

        if (res.data) {

          this.pageConfig.currentPage = res.data.page;
          this.pageConfig.totalItems = res.data.total;

          for (const i in res.data.content) {
            this.betRecord.push(res.data.content[i]);
          }

          this.betSumTotal = res.data.sumTotal;
        }

      });

  }


  getBetDetail(idx, item): void {

    console.log('getBetDetail', item);

    if (this.betDetailId == idx) {
      this.betDetailId = -1;
      return;
    }

    this.betDetailId = idx;
    this.betQry = {
      platformId: item.platformId,
      page: 1,
      startTime: item.startTime,
      endTime: item.endTime
    };

    this.betDetails = [];
    this.getBetLog();

  }


  getBetLog(): void {
    this.logService.betLog(this.betQry)
      .subscribe((res: any) => {

        this.betDetails = this.betDetails.concat(res.data.content);

        this.isMoreHidden = res.data.total === 0 ? false : res.data.total !== this.betDetails.length;

      });
  }

  moreBetLog(): void {
    this.betQry.page += 1;
    this.getBetLog();
  }



  setTime(evt): void {

    this.daterangepicker.patchValue([
      new Date(evt.start),
      new Date(evt.end)
    ]);

  }

  walletChange(wallet: number) {
    this.gamePlatforms = this.publicService.platforms.platforms
    console.log(this.gamePlatforms);
    let curWallet = this.walletOptions.find(item => item.id == wallet);
    this.gamePlatforms = this.gamePlatforms.filter(item => curWallet.platforms.indexOf(item.id) != -1);

    console.log(wallet, this.gamePlatforms, curWallet);

  }

}
