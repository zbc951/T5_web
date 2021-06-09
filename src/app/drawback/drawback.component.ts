import { LangService } from './../app-service/lang.service';
import { MemberService, checkPopupType } from './../app-service/member.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drawback',
  templateUrl: './drawback.component.html',
})
export class DrawbackComponent implements OnInit {

  records = [];
  serial_num = '';

  itemsPerPage;
  currentPage;
  totalItems;
  translationsRecordType;

  @Output() closeEvt = new EventEmitter();

  constructor(
    private memberService: MemberService,
    private langService: LangService
  ) {

    this.langService.onloadSub
      .subscribe((boo) => {
        if (boo) {

          this.translationsRecordType = this.langService.translations.MEMBER_WITHDRAW.record_type;

          // console.log('translationsRecordType', this.translationsRecordType);

        }

      });
  }

  ngOnInit(): void {
    this.serial_num = this.memberService.serial_num;
    this.getData();
  }


  getData(page = 1): void {
    this.memberService.getWaterBackfillDetail(this.memberService.members_bet_amount_record_id, page)
      .subscribe((res: any) => {

        if (res.content) {

          this.itemsPerPage = res.perPage;
          this.currentPage = res.page;
          this.totalItems = res.total;

          this.records = res.content;

        }

      });
  }

  close(): void {
    this.closeEvt.emit(checkPopupType.drawback);
  }

  changePage(page): void {

    this.getData(page);
  }


  pageChanged(evt): void {

    this.changePage(evt);

  }

}
