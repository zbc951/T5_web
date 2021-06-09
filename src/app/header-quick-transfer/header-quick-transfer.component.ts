import { MemberService } from './../app-service/member.service';
import { ToastService } from './../app-service/toast.service';
import { PublicService } from './../app-service/public.service';
import { WalletService, moneyLoadStatus } from './../app-service/wallet.service';
import { AuthService } from './../app-service/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-quick-transfer',
  templateUrl: './header-quick-transfer.component.html',
  // styleUrls: ['./header-quick-transfer.component.scss']
})
export class HeaderQuickTransferComponent implements OnInit {


  moneyLoadStatus = moneyLoadStatus;
  platformWallet = [];

  data$;

  constructor(
    private auth: AuthService,
    private walletService: WalletService,
    private toast: ToastService,
    private memberService: MemberService
  ) { }

  ngOnInit(): void {

    this.data$ = this.walletService.getMultiPlatforms()
      .subscribe((res) => {

        // console.log('**getMultiPlatforms res', res);

        this.platformWallet = res;

        this.getTransAllBalance();

      });
  }

  transferIn(p): void {

    const user = this.auth.user;

    p.getStatus = moneyLoadStatus.LOADING;

    this.walletService
      .getMultiTranceIn(p.key, user.wallet.money, p.id)
      .subscribe(
        (res) => {
          p.getStatus = moneyLoadStatus.GOT;
          this.memberService.wallet();
        },
        (err) => {

          // console.log('err', err, typeof err.error);

          p.getStatus = moneyLoadStatus.GOT;

          if (err.error.message && typeof err.error.message == 'string') {

            this.toast.error(err.error.message);
            return;

          }

          if (err.error && typeof err.error == 'string') {
            this.toast.error(err.error);

          }

          if (err.error && typeof err.error == 'string') {

            this.toast.error(err.error);
            return;

          }

          this.toast.error(err.message);


        });

  }

  getTransAllBalance(): void {

    this.platformWallet.forEach((platform: any) => {

      platform.getStatus = moneyLoadStatus.LOADING;

      this.walletService.getMultiBalance(platform.key)
        .subscribe(
          (balanceRes: any) => {

            if (balanceRes.result == 'ok') {
              platform.getStatus = moneyLoadStatus.GOT;
              platform.balance = balanceRes.balance;
            }
          }, (err) => {
            platform.getStatus = moneyLoadStatus.GOT;
          });
    });
  }

  ngOnDestroy(): void {

    if (this.data$) {

      this.data$.unsubscribe();

    }
  }

}
