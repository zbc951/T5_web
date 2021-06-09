import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { DayjsService, timeFormat } from './../app-service/dayjs.service';
import { debounceTime } from 'rxjs/operators';
import { MemberService, amountType } from './../app-service/member.service';
import { AppRoutes } from './../constant/routes';
import { ToastService, ToastType } from './../app-service/toast.service';
import { WalletService, walletType } from './../app-service/wallet.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from './../app-service/auth.service';
import { LangService } from './../app-service/lang.service';

@Component({
  selector: 'app-coupon-wallet',
  templateUrl: './coupon-wallet.component.html',
  // styleUrls: ['./coupon-wallet.component.scss']
})
export class CouponWalletComponent implements OnInit, OnDestroy {

  walletType = walletType;
  AppRoutes = AppRoutes;

  @Input() type: string;
  @Input() tab: string;

  couponWalletOpen = false;


  couponWallet = [];

  $data;
  clientTime;

  isActivityLogShow = false;
  activityLogId;

  constructor(
    private walletService: WalletService,
    private auth: AuthService,
    private toastService: ToastService,
    private langService: LangService,
    private memberService: MemberService
  ) {



  }

  ngOnInit(): void {

    // console.log('tab', this.tab);

    if (this.tab == walletType.COUPON_HISTORY) {


      this.walletService.getActivityWalletHistory()
        .subscribe((res) => {

          // console.log('getActivityWalletHistory', res);
          this.couponWallet = res.data.content;
        });

    } else {

      this.subscribeLog();

      this.walletService.getActivityWalletLogBySubject();

      this.memberService.getAmount([
        amountType.able,
        amountType.activity,
        amountType.total])
        .subscribe();
    }

  }

  subscribeLog() {
    this.$data = this.walletService.getActivityWalletLogSub()
      .pipe(debounceTime(500))
      .subscribe((res: any) => {

        // console.log('getActivityWalletLogSub*', res);
        if (res.data?.total > 0) {

          this.clientTime = DayjsService.now(false);

          // console.log('clientTime', this.clientTime);

          res.data.content.forEach((item) => {

            item.limitGiveUp = Number(item.limitGiveUp);

            // console.log(item.endAt);
            if (item.endAt) {
              const endAt = DayjsService.getDayjsObj(item.endAt);
              item.isOverdue = (this.clientTime.isBefore(endAt) === false) ? true : false;

            } else {
              item.isOverdue = false;
            }


          });


          this.couponWallet = res.data.content;
          // console.log(this.couponWallet);

        }
      });
  }


  walletOpen(): void {
    this.couponWalletOpen = !this.couponWalletOpen;
  }

  transIn(item) {
    let data = {
      purchaseLogId: item.id
    };

    this.walletService.getFromWalletActivityWallet(data)
      .subscribe(
        (res: any) => {
          // console.log('resssss', res);
          if (res.result === 'ok') {

            this.auth.getWallet();
            this.ngOnInit();

          } else {

            this.toastService.error(this.langService.translations.SERVER_ERROR);

          }
        },
        (err) => {
          // console.log('err', err);
          if (err.error && typeof err.error === 'string') {
            this.toastService.error(err.error);

          }
        });
  }

  giveup(item) {

    let data = {
      purchaseLogId: item.id
    };

    this.walletService.giveup(data)
      .subscribe(
        (res: any) => {
          if (res.result === 'ok') {

            this.auth.getWallet();
            this.ngOnInit();

          } else {

            this.toastService.error(this.langService.translations.SERVER_ERROR);

          }
        },
        (err) => {
          console.log('err', err);
          if (err.error && typeof err.error === 'string') {
            this.toastService.error(err.error);
          } else {

            this.toastService.error(err.error.message);
          }




        }
      );

  }


  checkoutLog(logId) {
    console.log("checkoutLog", logId);
    this.activityLogId = logId;
    this.isActivityLogShow = true;
  }


  closePopup() {

    this.isActivityLogShow = false;
  }

  ngOnDestroy(): void {
    if (this.tab == walletType.COUPON) {
      this.$data.unsubscribe();
    }

  }
}

