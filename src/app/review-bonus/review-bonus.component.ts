import { LogService } from './../app-service/log.service';
import { PublicService } from './../app-service/public.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LangService, lang } from './../app-service/lang.service';
import { DayjsService, timeFormat } from './../app-service/dayjs.service';
@Component({
  selector: 'app-review-bonus',
  templateUrl: './review-bonus.component.html',
  // styleUrls: ['./review-bonus.component.scss']
})
export class ReviewBonusComponent implements OnInit {

  pageConfig: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };


  locale = 'zh';
  form: FormGroup;
  daterangepicker = new FormControl('');
  data;
  gamePlatforms = [];

  constructor(

    private formBuilder: FormBuilder,
    private publicService: PublicService,
    private translate: TranslateService,
    private logService: LogService,
    private langService: LangService
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
      platformId: []
    });

    this.gamePlatforms = this.publicService.platforms.platforms;
  }

  ngOnInit(): void {
    this.form.controls.platformId.patchValue(this.gamePlatforms[0].id);
  }

  queryBonus(): void {
    console.log('queryBet');

    const formdata = Object.assign({}, this.form.value);

    formdata.pagpe = this.pageConfig.page;

    const period = this.daterangepicker.value;

    formdata.startTime = DayjsService.getDayjsObj(period[0], timeFormat);
    formdata.endTime = DayjsService.getDayjsObj(period[1], timeFormat);

    formdata.platformId = [formdata.platformId];

    this.logService.bonusLog(formdata)
      .subscribe((res: any) => {

        console.log('bonusLog', res);
        this.data = res.data;
        this.pageConfig.totalItems = this.data.total;
        this.pageConfig.itemsPerPage = this.data.perPage;
        this.pageConfig.currentPage = this.data.page;

      });
  }


  pageChanged(event): void {
    this.pageConfig.currentPage = event;
  }

  resetPageConfig(): void {
    this.pageConfig = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0,
    };
  }

  setTime(evt): void {

    this.daterangepicker.patchValue([
      new Date(evt.start),
      new Date(evt.end)
    ]);

  }

}
