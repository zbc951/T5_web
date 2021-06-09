import { PopupForgetPasswordComponent } from './popup-forget-password/popup-forget-password.component';
import { MemberComponent } from './member/member.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutes } from './constant/routes';

import { HomeComponent } from './home/home.component';
import { HelpComponent } from './help/help.component';
import { PopupBulletinComponent } from './popup-bulletin/popup-bulletin.component';
import { GameComponent } from './game/game.component';
import { PopupRegisterComponent } from './popup-register/popup-register.component';
import { MerchantsComponent } from './merchants/merchants.component';
import { VipComponent } from './vip/vip.component';
import { PopupTransferComponent } from './popup-transfer/popup-transfer.component';
import { SlotCenterComponent } from './slot-center/slot-center.component';
import { AuthGuard } from './app-service/auth.guard';
import { DepositComponent } from './deposit/deposit.component';
import { BankCardComponent } from './bank-card/bank-card.component';
import { LetterComponent } from './letter/letter.component';
import { LetterDetailComponent } from './letter-detail/letter-detail.component';
import { BetLogComponent } from './bet-log/bet-log.component';
import { QuestCenterComponent } from './quest-center/quest-center.component';
import { PopupVipPointComponent } from './popup-vip-point/popup-vip-point.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: AppRoutes.HOME,
    pathMatch: 'full',
  },
  {
    path: AppRoutes.HOME,
    component: HomeComponent,
  },
  {
    path: AppRoutes.SPORT,
    component: GameComponent,
  },
  {
    path: AppRoutes.LIVE,
    component: GameComponent,
  },

  {
    path: AppRoutes.LOTTO,
    component: GameComponent,
  },
  {
    path: AppRoutes.FISH,
    component: SlotCenterComponent,
  },
  {
    path: AppRoutes.BOARD,
    component: SlotCenterComponent,
  },
  {
    path: AppRoutes.PLATFORM,
    component: GameComponent,
  },
  {
    path: AppRoutes.SlotCenter,
    component: SlotCenterComponent,
  },

  // {
  //   path: AppRoutes.LOGIN,
  //   component: LoginComponent
  // },
  {
    path: AppRoutes.REGISTER,
    component: PopupRegisterComponent,
    // outlet: 'popup',
  },
  {
    path: AppRoutes.TRANSPOPUP,
    component: PopupTransferComponent,
    outlet: 'popup',
    canActivate: [AuthGuard]
  },
  {
    path: AppRoutes.FORGET,
    component: PopupForgetPasswordComponent,
    outlet: 'popup'
  },
  {
    path: AppRoutes.BULLETIN,
    component: PopupBulletinComponent,
    outlet: 'popup',
  },
  {
    path: AppRoutes.DEPOSIT,
    component: MemberComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.WITHDRAWAL,
    component: MemberComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.BANK_CARD,
    component: MemberComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.USER_INFO,
    component: MemberComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.TRANSFER,
    component: MemberComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.MY_WALLET,
    component: MemberComponent,
    canActivate: [AuthGuard],
  },
  // {
  //   path: AppRoutes.TRADE_RECORD,
  //   component: TradeRecordComponent,
  //   canActivate: [AuthGuard]
  // },
  {
    path: AppRoutes.VIP,
    component: MemberComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.REVIEW_MAIN,
    component: MemberComponent,
    canActivate: [AuthGuard]
  },
  {
    path: AppRoutes.QUEST,
    component: QuestCenterComponent,
  },
  {
    path: AppRoutes.Activity_Wallet,
    component: QuestCenterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: AppRoutes.OLD_QUEST_CENTER,
    component: MemberComponent,
    canActivate: [AuthGuard],
  },
  // {
  //   path: AppRoutes.PUBLIC_QUEST,
  //   component: PreferentialComponent
  // },
  // {
  //   path: AppRoutes.PUBLIC_QUEST_DETAILS,
  //   component: PopupPreferentialDetailsComponent,
  //   outlet: 'popup'
  // },
  // {
  //   path: AppRoutes.SERVICE,
  //   component: CommonProblemComponent,
  // },
  {
    path: AppRoutes.HELP,
    component: HelpComponent,
  },
  {
    path: AppRoutes.COMMON_PROBLEM,
    component: HelpComponent,
  },
  // {
  //   path: AppRoutes.CONTACT,
  //   component: PopupContactComponent,
  //   outlet: 'popup'
  // },
  // {
  //   path: AppRoutes.POLICY,
  //   component: PolicyComponent,
  //   outlet: 'popup'
  // }
  {
    path: AppRoutes.MERCHANTS,
    component: MerchantsComponent,
  },
  {
    path: AppRoutes.LETTER,
    component: MemberComponent,
  },
  {
    path: AppRoutes.LETTER_DETAIL,
    component: MemberComponent,
  },
  {
    path: AppRoutes.BET_LOG,
    component: MemberComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      // enableTracing: true
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
