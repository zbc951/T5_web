import { LangService } from './../app-service/lang.service';
import { MemberService } from './../app-service/member.service';
import { BankService } from './../app-service/bank.service';
import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';


enum tabs {
  INFO,
  platform
}

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  // styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  tabs = tabs;
  tab = tabs.INFO;

  lv = 0;
  lvTxt = '';

  isBaseFilled = false;
  isHavingBankcards = false;
  isHavingEmail = false;

  private data$;



  constructor(
    private bankService: BankService,
    private memberService: MemberService,
    private langService: LangService

  ) { }

  ngOnInit(): void {

    this.data$ = forkJoin([
      this.memberService.getInfo(),
      this.bankService.banks()]
    )
      .subscribe((res: any[]) => {

        const security = this.langService.translations.MEMBER_INFO.security;

        const lvTxtArr = [
          security.low,
          security.middle_low,
          security.middle,
          security.high
        ];

        const basedata = res[0].data;
        if (basedata) {

          const { name, birth, line, wechat, email } = basedata;

          if (name && birth && (line || wechat)) {
            this.isBaseFilled = true;
            this.lv++;
          }

          if (email) {
            this.isHavingEmail = true;
            this.lv++;
          }

        }

        const bankdata = res[1].data;
        if (bankdata && bankdata.length > 0) {
          this.isHavingBankcards = true;
          this.lv++;
        }
        this.lvTxt = lvTxtArr[this.lv];

        this.langService.onloadSub
          .subscribe((boo) => {

            const security = this.langService.translations.MEMBER_INFO.security;

            const lvTxtArr = [
              security.low,
              security.middle_low,
              security.middle,
              security.high
            ];

            this.lvTxt = lvTxtArr[this.lv];
          });

      });


  }

  selectType(t): void {

    this.tab = t;

  }

  update(): void {

    this.ngOnInit();

  }

}
