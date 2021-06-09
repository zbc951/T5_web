import { MemberService, checkPopupType } from './../app-service/member.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-withdraw-bet-record',
  templateUrl: './withdraw-bet-record.component.html',
  // styleUrls: ['../../scss/component/withdraw_lock_detail.component.scss']
})
export class WithdrawBetRecordComponent implements OnInit {

  records = [];
  serial_num = '';
  deductionBetAmount;
  makeUpBetAmount;

  pageConfig: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
    id: 'bet-record'
  };

  @Output() closeEvt = new EventEmitter();


  constructor(
    private memberService: MemberService
  ) {}

  ngOnInit(): void {

    this.serial_num = this.memberService.serial_num;
    this.getData();

  }

  // ngAfterViewInit(): void {
  //   this.getData();
  // }

  getData(page = 1): void {
    this.memberService.getbetamountlogdetail(this.memberService.members_bet_amount_record_id, page)
      .subscribe((res: any) => {

        if (res.content) {
          this.pageConfig.itemsPerPage = res.perPage;
          this.pageConfig.currentPage = res.page;
          this.pageConfig.totalItems = res.total;
          this.records = res.content;
          this.deductionBetAmount = res.deductionBetAmount;
          this.makeUpBetAmount = res.makeUpBetAmount;
        }

      });
  }




  close(): void {

    this.closeEvt.emit(checkPopupType.bet);

  }

  public changePage(page): void {

    this.getData(page);
  }


  pageChanged(evt): void {

    this.changePage(evt);

  }

}
