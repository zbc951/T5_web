import { ReviewService, EnumStatus } from './../app-service/review.service';
import { Component, OnInit } from '@angular/core';
import { LangService, lang } from './../app-service/lang.service';
import { LogService, reviewType } from './../app-service/log.service';
import { Tabs as searchType } from './../search-panel/search-panel.component';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',

  // styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  reviewType = reviewType;
  searchType = searchType;
  // EnumStatus = EnumStatus;

  pageConfig: any = {
    itemsPerPage: 10,
    // itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
  };

  reviewOptions = [];
  data: any;
  statusMap;
  depositCntMap;
  withdrawCntMap;
  typeNameNow = '';
  formdata;
  type;
  dataLoaded = false;

  constructor(
    private reviewService: ReviewService,
    private langService: LangService,
  ) {

  }

  ngOnInit(): void {
    const { translations } = this.langService;
    this.reviewOptions = [
      {
        label: translations.NEWBIE.DEPOSIT.TITLE,
        value: reviewType.deposit
      },
      {
        label: translations.NEWBIE.WITHDRAW.TITLE,
        value: reviewType.withdraw
      },
      {
        label: translations.MEMBER_NAV.ACTIVITY_WALLET,
        value: reviewType.activityWallet
      },
    ];

    this.type = reviewType.deposit;


    this.statusMap = {
      // '': '全部',
      // review: '审核中',
      review: translations.REVIEW_STATUS.REVIEW,
      // approved: '审核通过',
      approved: translations.REVIEW_STATUS.APPROVED,
      // disapproved: '审核不通过'
      disapproved: translations.REVIEW_STATUS.DISAPPROVED
    };


    this.depositCntMap = {
      'review_third_party_deposit': translations.MEMBER_REVIEW.review_third_party_deposit,
      'review_member_deposit_bank': translations.MEMBER_REVIEW.review_member_deposit_bank
    };

    this.withdrawCntMap = {
      'none': '',
      'bank': translations.MEMBER_REVIEW.review_member_deposit_bank,
      'third': translations.MEMBER_REVIEW.review_withdraw_third
    };

    this.data = [];

  }

  pageChanged(event): void {
    this.pageConfig.currentPage = event;
    this.searchReview(this.formdata);
  }

  searchReview(evt): void {

    // console.log('searchReview evt', evt);

    if (this.formdata && this.formdata.reviewType != evt.reviewType) {
      this.resetPageConfig();
    }

    this.formdata = Object.assign({}, evt);
    this.formdata.page = this.pageConfig.currentPage;
    this.formdata.perPage = this.pageConfig.itemsPerPage;

    this.data = [];
    // console.log('formdata', this.formdata);
    // this.type = evt.reviewType;
    switch (evt.reviewType) {
      // switch (type) {
      case reviewType.deposit:

        this.reviewService.deposit(this.formdata)
          .subscribe((res: any) => {

            // console.log('deposit res', res);

            res.data.content.forEach((item) => {

              item.statTxt = this.statusMap[item.status];
              item.cntTxt = this.depositCntMap[item.tableName];

            });

            this.type = evt.reviewType;

            this.typeNameNow = this.reviewOptions[0].label;
            this.data = res.data;
            this.pageConfig.totalItems = this.data.total;
            this.pageConfig.itemsPerPage = this.data.perPage;
            this.pageConfig.currentPage = this.data.page;
            this.dataLoaded = true;
            this.removeFadeIn();
          });


        break;

      case reviewType.withdraw:

        this.formdata.transactionStatus = '';
        this.reviewService.withdraw(this.formdata)
          .subscribe((res: any) => {

            // console.log('this.reviewService.withdraw', res);

            res.data.content.forEach((item: any) => {


              // console.log('item.status', item.status, this.statusMap[item.status]);

              item.statTxt = this.statusMap[item.status];
              item.cntTxt = this.withdrawCntMap[item.type];

              if (item.status !== 'approved') {

                item.transactionStatusTxt = '';

              } else {

                item.transactionStatusTxt = this.langService.translations.TRANSACTION_STATUS[item.transactionStatus];

              }
            });

            this.data = res.data;

            this.typeNameNow = this.reviewOptions[1].label;
            this.pageConfig.totalItems = this.data.total;
            this.pageConfig.itemsPerPage = this.data.perPage;
            this.pageConfig.currentPage = this.data.page;
            this.type = evt.reviewType;
            this.dataLoaded = true;
            this.removeFadeIn();

          });
        break;

      case reviewType.activityWallet:

        this.formdata.transactionStatus = '';
        this.reviewService.activityWallet(this.formdata)
          .subscribe((res: any) => {

            // console.log('this.reviewService.activityWallet', res);

            res.data.content.forEach((item: any) => {


              // console.log('item.status', item.status, this.statusMap[item.status]);

              item.statTxt = this.statusMap[item.status];
              item.cntTxt = item.name;
              item.money = item.price;

              if (item.status !== 'approved') {

                item.transactionStatusTxt = '';

              } else {

                item.transactionStatusTxt = this.langService.translations.TRANSACTION_STATUS[item.transactionStatus];

              }

            });

            this.data = res.data;

            this.typeNameNow = this.reviewOptions[2].label;
            this.pageConfig.totalItems = this.data.total;
            this.pageConfig.itemsPerPage = this.data.perPage;
            this.pageConfig.currentPage = this.data.page;
            this.type = evt.reviewType;
            this.dataLoaded = true;
            this.removeFadeIn();
          });
        break;

      default:
        break;
    }



  }


  removeFadeIn(): void {

    setTimeout(() => {
      this.dataLoaded = false;
    }, 1000);

  }

  onanimationend(evt): void {

    this.dataLoaded = false;

  }


  resetPageConfig(): void {
    this.pageConfig = {
      itemsPerPage: 10,
      // itemsPerPage: 5,
      currentPage: 1,
      totalItems: 0,
    };
  }

}
