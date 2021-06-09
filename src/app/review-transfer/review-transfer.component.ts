import { PublicService } from './../app-service/public.service';
import { ToastService } from './../app-service/toast.service';
import { LogService, EnumWalletLogType, reviewType } from './../app-service/log.service';
import { Component, OnInit } from '@angular/core';
import { LangService, lang } from './../app-service/lang.service';
import { Tabs as searchType } from './../search-panel/search-panel.component';


enum logtypGroups {
  "group-deposit" = "group-deposit",
  "group-withdraw" = "group-withdraw",
  "group-transfer" = "group-transfer",
  "group-water" = "group-water",
  "group-activity-wallet" = "group-activity-wallet",
  "group-others" = "group-others"
}

enum withdrawType {
  transferGame = 'transfer-game',
  transferWallet = "transfer-wallet",
  mounted = 'mounted',
  unmounted = 'unmounted'
}

@Component({
  selector: 'app-review-transfer',
  templateUrl: './review-transfer.component.html',
  // styleUrls: ['./review-transfer.component.scss']
})
export class ReviewTransferComponent implements OnInit {

  searchType = searchType;
  logtypGroups = logtypGroups;
  withdrawType = withdrawType;

  EnumWalletLogType = EnumWalletLogType;

  RECORD_REVIEW_OPTIONS;
  REVIEW_STATUS;
  REVIEW_TRANSFER_TYPE;
  REVIEW_WATER_TYPE;
  REVIEW_ACTIVITY_TYPE;

  pageConfig: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };

  listData: any = [];
  typeOptions: {
    label: string,
    value: string,
  }[] = [];

  formdata;
  isOptionChanged = false;

  queryType;

  constructor(
    private logService: LogService,
    private langService: LangService,
    private toast: ToastService,
    private publicService: PublicService
  ) {

    this.publicService.isMemberModeOnSub
      .subscribe((isMemberModeOn) => {

        this.langService.onloadSub.subscribe((boo) => {

          if (boo) {


            const translations = this.langService.translations;
            this.RECORD_REVIEW_OPTIONS = translations.RECORD_REVIEW_OPTIONS;
            // console.log('EnumWalletLogType', EnumWalletLogType);

            this.REVIEW_STATUS = translations.REVIEW_STATUS;
            this.REVIEW_TRANSFER_TYPE = translations.REVIEW_TRANSFER_TYPE;
            this.REVIEW_WATER_TYPE = translations.REVIEW_WATER_TYPE;
            this.REVIEW_ACTIVITY_TYPE = translations.REVIEW_ACTIVITY_TYPE;


            const tmptypeOptions = [];
            // tslint:disable-next-line: forin
            // for (const p in EnumWalletLogType) {
            for (const p in logtypGroups) {

              // console.log('p', p);

              tmptypeOptions.push(
                {
                  // type: p,
                  // name: this.RECORD_REVIEW_OPTIONS[p],

                  label: this.RECORD_REVIEW_OPTIONS[p],
                  value: p
                }
              );

            }


            if (isMemberModeOn == false) {

              tmptypeOptions.forEach((item) => {

                if (item.value == 'group-water') {
                  item.label = this.RECORD_REVIEW_OPTIONS['group-water-off'];
                }

              });

            }

            this.typeOptions = tmptypeOptions;

            // console.log('*typeOptions', this.typeOptions);

          }

        });
      });


  }

  ngOnInit(): void {

    if (!this.publicService.isActivityWallet) {

      // console.log(this.typeOptions);

      this.typeOptions = this.typeOptions.filter((item: any) => {

        return item.value !== logtypGroups['group-activity-wallet'];

      });


      const translations = this.langService.translations;
      this.typeOptions[2].label = translations.TRANSFER.TITLE;
      // console.log('**typeOptions', this.typeOptions);

    }
  }

  pageChanged(event): void {
    this.pageConfig.currentPage = event;
    this.searchReview(this.formdata);
  }

  searchReview(evt = null): void {

    // const formdata = Object.assign({}, this.pageConfig, this.form.value);

    if (this.isOptionChanged) {
      this.resetPageConfig();
      this.isOptionChanged = false;
    }

    this.formdata = Object.assign({}, evt);
    console.log('**', this.formdata);

    this.queryType = this.formdata.type;

    this.formdata.page = this.pageConfig.currentPage;
    this.formdata.perPage = this.pageConfig.itemsPerPage;

    this.logService.walletTypeGroup(this.formdata)
      .subscribe(
        (res: any) => {

          console.log('walletLog res', res);

          this.listData = res.data.content;

          this.pageConfig.totalItems = res.data.total;
          this.pageConfig.itemsPerPage = res.data.perPage;
          this.pageConfig.currentPage = res.data.page;

          // console.log('listData', this.listData);

        },
        (err) => {

          // console.log('**', err.error.errors);

          this.toast.error(err.error.message);

        });

  }

  resetPageConfig(): void {
    this.pageConfig = {
      itemsPerPage: 10,
      // itemsPerPage: 5,
      currentPage: 1,
      totalItems: 0,
    };
  }

  optionChange(): void {
    this.isOptionChanged = true;
  }

}
