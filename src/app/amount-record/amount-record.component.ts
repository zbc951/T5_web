import { LangService } from './../app-service/lang.service';
import { MemberService, checkPopupType } from './../app-service/member.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-amount-record',
  templateUrl: './amount-record.component.html',
  // styleUrls: ['./amount-record.component.scss']
})
export class AmountRecordComponent implements OnInit {

  records = [];

  pageConfig: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
    id: 'amount-record'
  };

  translationsRecordType;

  isDrawbackShow;
  isBetRecordShow;

  constructor(
    private memberService: MemberService,
    private langService: LangService
  ) {

    this.isDrawbackShow = false;
    this.isBetRecordShow = false;
    this.langService.onloadSub
      .subscribe((boo) => {
        if (boo) {

          this.translationsRecordType = this.langService.translations.MEMBER_WITHDRAW.record_type;

          // console.log('translationsRecordType', this.translationsRecordType);

        }

      });
  }

  ngOnInit(): void {

    this.getLogsBetamountlog();

  }

  getLogsBetamountlog(page = 1): void {
    console.log('getLogsBetamountlog');
    this.memberService.getLogsBetamountlog(page)
      .subscribe(
        (res: any) => {

          console.log('getLogsBetamountlog', res);

          if (res.content) {

            this.pageConfig.itemsPerPage = res.perPage;
            this.pageConfig.currentPage = res.page;
            this.pageConfig.totalItems = res.total;
            this.records = res.content;
          }
        },
        err => {
        });
  }

  expand(item): void {

    item.isRecordExpand = !item.isRecordExpand;

  }

  openDrawBack(item): void {
    this.memberService.checkoutDrawback(item.id, item.serial_num);

    this.isDrawbackShow = !this.isDrawbackShow;
  }

  openBetlist(item): void {

    // console.log('openBetlist', item);

    this.memberService.checkoutDrawback(item.id, item.serial_num);
    this.isBetRecordShow = !this.isBetRecordShow;

  }

  closePopup(evt): void {

    switch (evt) {

      case checkPopupType.drawback:
        this.isDrawbackShow = false;
        break;

      case checkPopupType.bet:
        this.isBetRecordShow = false;
        break;

    }

  }


  changePage(page): void {

    this.getLogsBetamountlog(page);
  }


  pageChanged(evt): void {

    this.changePage(evt);

  }

}
