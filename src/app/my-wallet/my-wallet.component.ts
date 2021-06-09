import { LangService } from './../app-service/lang.service';
import { ToastService } from './../app-service/toast.service';
import { debounceTime, first } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { PublicService } from './../app-service/public.service';
import { MemberService, amountType } from './../app-service/member.service';
import { AuthService } from './../app-service/auth.service';
import { Component, OnInit } from '@angular/core';
import { WalletService, moneyLoadStatus, walletType } from './../app-service/wallet.service';


@Component({
  selector: 'app-my-wallet',
  templateUrl: './my-wallet.component.html',
  // styleUrls: ['./my-wallet.component.scss']
})
export class MyWalletComponent implements OnInit {

  type = 'mine';
  walletType = walletType;
  currType = '';

  user;
  total_0 = 0;
  total = 0;

  walletSumup = 0;

  ableMoney = 0;
  platformWallet = [];
  $data;
  $data1;

  isActivityWallet;
  // $data;
  unmounting = false;
  apiResponseCount = 0;
  isLoading = false;


  // for isActivityWallet=false
  allPlatforms;


  constructor(

    private publicService: PublicService,
    private auth: AuthService,
    private walletService: WalletService,
    private memberService: MemberService,
    private toast: ToastService,
    private langService: LangService

  ) {

    this.user = this.auth.user;

    this.auth.getWallet();

    this.auth.getWalletSub()
      .subscribe((res: boolean) => {

        console.log('getWalletSub', res);

        if (res) {
          this.user = this.auth.user;
          // console.log('user', this.user);
          this.total = this.user.wallet.money;
          // console.log('user', this.user, this.user.wallet.money, this.total);
        }
      });

    this.$data = combineLatest([
      this.walletService.getMultiPlatforms(),
      this.memberService.getAmountSub()
    ])
      .pipe(debounceTime(500))
      .subscribe((res: any[]) => {

        // console.log('** res', res);

        this.platformWallet = res[0];
        const amountdata = res[1];

        if (amountdata.data && this.platformWallet.length > 0) {

          // this.total = parseFloat(amountdata.data.total_money);

          this.isActivityWallet = this.publicService.isActivityWallet;

          // if (this.isActivityWallet) {

          //   this.total = this.total_0 = parseFloat(amountdata.data.total_money);
          //   this.walletSumup = amountdata.data.activity_wallet_total;


          // } else {
          //   this.total = this.user.wallet.money;
          // }

          this.total = this.user.wallet.money;

          this.ableMoney = Number(amountdata.data.able_money);

        }

      });

  }

  ngOnInit(): void {

    this.isActivityWallet = this.publicService.isActivityWallet;

    // if (this.isActivityWallet) {

    //   this.currType = walletType.COUPON;
    //   this.walletService.getMultiWalletPlatforms();

    // } else {

    //   this.currType = walletType.PLATFORM;

    //   this.getMultiPlatforms();
    // }

    this.currType = walletType.PLATFORM;

    this.getMultiPlatforms();


    this.getAmount();

  }

  ngOnDestroy(): void {

    this.$data.unsubscribe();

    if (this.$data1) {
      this.$data.unsubscribe();
    }

  }

  getAmount(): void {

    // if (this.isActivityWallet) {

    //   this.memberService.getAmount([
    //     amountType.able,
    //     amountType.activity,
    //     amountType.total
    //   ])
    //     .subscribe();

    // } else {

    //   this.memberService.getAmount([
    //     amountType.able,
    //     amountType.total
    //   ])
    //     .subscribe();
    // }

    this.memberService.getAmount([
      amountType.able,
      amountType.total
    ])
      .subscribe();

  }

  getTransAllBalance(): void {


    console.log('getTransAllBalance');

    this.platformWallet.forEach((platform: any) => {

      platform.getStatus = moneyLoadStatus.LOADING;

      this.getMultiBalance(platform);

    });
  }

  getMultiBalance(platform): void {

    // console.log('getMultiBalance', platform.key);

    this.walletService.getMultiBalance(platform.key)
      .subscribe(
        (balanceRes: any) => {

          if (balanceRes.result == 'ok') {
            platform.getStatus = moneyLoadStatus.GOT;

            platform.balance = Number(balanceRes.balance);

            let tmpSum = 0;
            this.platformWallet.forEach((p: any) => {

              tmpSum += Number(p.balance);
            });


            // if (this.isActivityWallet) {
            //   this.total = Number(this.total_0) + tmpSum;
            // }

            this.unmounting = false;

          }
        }, (err) => {
          platform.getStatus = moneyLoadStatus.GOT;
        });

  }

  getMultiPlatforms() {

    // console.log('getMultiPlatforms');

    this.$data1 =
      this.walletService.getMultiPlatforms()
        .pipe(first())
        .subscribe((res) => {

          this.allPlatforms = [...res];

        });
  }

  getTransAllBalanceForBackAll() {

    // console.log('getTransAllBalanceForBackAll');

    this.apiResponseCount = this.platformWallet.length;
    this.isLoading = true;

    this.platformWallet.forEach((platform: any) => {

      // console.log('getMultiBalance', platform.key);
      this.walletService.getMultiBalance(platform.key)
        .subscribe(
          (balanceRes: any) => {

            if (balanceRes.result == 'ok') {
              platform.balance = balanceRes.balance;
            }
          }, (err) => {
          }).add(() => {

            this.apiResponseCount--;

            if (this.apiResponseCount == 0) {

              this.isLoading = false;
              this.tranferBackAll();

            }

          });
    });
  }

  clickBackAll() {
    // 現在 我需要先更新平台的錢

    this.getTransAllBalanceForBackAll();

  }


  tranferBackAll() {

    // 沒錢的平台 要不用 轉了
    const platformsWithBal = this.platformWallet.filter((p) => {
      return Number(p.balance);
    });

    // console.log('platformsWithBal', platformsWithBal);

    // 根本沒有有可以轉的平台
    if (platformsWithBal.length == 0) {
      return;
    }

    this.apiResponseCount = platformsWithBal.length;
    this.isLoading = true;

    // console.log('tranferBackAll', this.allPlatforms);

    this.allPlatforms.forEach((platform: any) => {

      const balance = Number(platform.balance);

      if (balance) {

        this.walletService.getMultiTranceOut(platform.key, platform.balance, platform.id)
          .subscribe(
            (balanceRes: any) => {

              this.tellShouldCloseLoading();

            }, (err) => {

              this.tellShouldCloseLoading();

            });
      }


    });
  }


  // unmountActivityWallet(): void {

  //   // batch calling

  //   this.apiResponseCount = this.platformWallet.length;
  //   console.log('apiResponseCount', this.apiResponseCount);
  //   this.isLoading = true;

  //   this.platformWallet.forEach((platform) => {

  //     this.walletService.unmountActivityWallet({
  //       platformId: platform.id
  //     })
  //       .subscribe(
  //         (res) => {

  //           // console.log('unmountActivityWallet res', res);
  //           if (res.result === 'ok') {


  //             this.unmounting = true;

  //             this.getMultiBalance(platform);

  //             if (this.currType === walletType.COUPON) {

  //               this.walletService.getActivityWalletLogBySubject();

  //             }

  //           } else {

  //             this.toast.error(this.langService.translations.SERVER_ERROR);

  //           }

  //           this.tellShouldCloseLoading();

  //         },
  //         (err) => {
  //           // console.log('err', err);
  //           if (err.error && typeof err.error === 'string') {
  //             this.toast.error(err.error);

  //           }
  //           this.tellShouldCloseLoading();
  //         }
  //       );

  //   });
  // }

  tellShouldCloseLoading() {
    if (this.apiResponseCount == 0) {
      return;
    }

    this.apiResponseCount--;
    // console.log('** tellShouldCloseLoading ', this.apiResponseCount);

    if (this.apiResponseCount == 0) {
      this.auth.getWallet();
      this.getAmount();
      this.isLoading = false;
      this.walletService.getMultiWalletPlatforms();

    }
  }

  walletTypeChange(type: string): void {
    this.currType = type;
  }


}
