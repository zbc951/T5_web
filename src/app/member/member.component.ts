import { LetterService } from './../app-service/letter.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../app-service/auth.service';
import { AppRoutes } from '../constant/routes';


@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  // styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  AppRoutes = AppRoutes;
  path;
  unread = 0;

  user: {
    account?: string,
    lv?: string,
    survival_day?: number
  } = {};

  public accountList: any[] = [
    { path: AppRoutes.DEPOSIT, title: "NEWBIE.DEPOSIT.TITLE" },
    { path: AppRoutes.TRANSFER, title: "NEWBIE.TRANSFER.TITLE" },
    { path: AppRoutes.WITHDRAWAL, title: "NEWBIE.WITHDRAW.TITLE" },
  ]

  public sideBarList: any[] = [
    // { path: AppRoutes.USER_INFO, style: 'user', title: 'MEMBER_NAV.INFO' },
    // { path: AppRoutes.VIP, style: 'vip', title: 'MEMBER_NAV.VIP' },
    // { path: AppRoutes.MY_WALLET, style: 'my-wallet', title: 'MEMBER_NAV.MY_WALLET' },
    // { path: AppRoutes.BANK_CARD, style: 'bank', title: 'MEMBER_NAV.BANK' },
    // { path: AppRoutes.REVIEW_MAIN, style: 'trans-log', title: 'MEMBER_NAV.TRANSFER_LOG' },
    // { path: AppRoutes.BET_LOG, style: 'bet-log', title: 'MEMBER_NAV.BET_LOG' },
    // { path: AppRoutes.OLD_QUEST_CENTER, style: 'quest', title: 'MEMBER_QUEST.APPLY_TAB' },
    // { path: AppRoutes.LETTER, style: 'letters', title: 'LETTER.TITLE' },
  ]

  canUpgrade = false;

  constructor(
    private auth: AuthService,
    private route: Router,
    private letterService: LetterService,
  ) {

    // console.log(this.route.url);
    this.path = this.route.url.split('/')[1];
    // console.log('path', this.path);

    this.auth.isLogin()
      .subscribe((isLogin) => {

        if (isLogin) {
          const { user } = this.auth;
          const lv = user.clubRank.split(')')[1].trim();
          user.lv = lv;

          /* 判斷是否還可以升級的層級, 會決定顯不顯 vip 頁面 */
          this.canUpgrade = this.auth.canUpgrade;

          if (this.canUpgrade) {

            this.sideBarList = [
              { path: AppRoutes.USER_INFO, style: 'user', title: 'MEMBER_NAV.INFO' },
              { path: AppRoutes.VIP, style: 'vip', title: 'MEMBER_NAV.VIP' },
              { path: AppRoutes.MY_WALLET, style: 'my-wallet', title: 'MEMBER_NAV.MY_WALLET' },
              { path: AppRoutes.BANK_CARD, style: 'bank', title: 'MEMBER_NAV.BANK' },
              { path: AppRoutes.REVIEW_MAIN, style: 'trans-log', title: 'MEMBER_NAV.TRANSFER_LOG' },
              { path: AppRoutes.BET_LOG, style: 'bet-log', title: 'MEMBER_NAV.BET_LOG' },
              { path: AppRoutes.OLD_QUEST_CENTER, style: 'quest', title: 'MEMBER_QUEST.APPLY_TAB' },
              { path: AppRoutes.LETTER, style: 'letters', title: 'LETTER.TITLE' },
            ];

          } else {

            this.sideBarList = [
              { path: AppRoutes.USER_INFO, style: 'user', title: 'MEMBER_NAV.INFO' },
              { path: AppRoutes.MY_WALLET, style: 'my-wallet', title: 'MEMBER_NAV.MY_WALLET' },
              { path: AppRoutes.BANK_CARD, style: 'bank', title: 'MEMBER_NAV.BANK' },
              { path: AppRoutes.REVIEW_MAIN, style: 'trans-log', title: 'MEMBER_NAV.TRANSFER_LOG' },
              { path: AppRoutes.BET_LOG, style: 'bet-log', title: 'MEMBER_NAV.BET_LOG' },
              { path: AppRoutes.OLD_QUEST_CENTER, style: 'quest', title: 'MEMBER_QUEST.APPLY_TAB' },
              { path: AppRoutes.LETTER, style: 'letters', title: 'LETTER.TITLE' },
            ];
          }

          this.user = user;
        }
      });

    this.letterService.getUnreads()
      .subscribe((res: any) => {

        this.unread = res;

      });
  }

  ngOnInit(): void {
  }

  goPage(path) {

    // console.log('goPage path', path);
    this.route.navigateByUrl(path);

  }

}
