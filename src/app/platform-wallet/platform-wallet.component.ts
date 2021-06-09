import { WalletService, moneyLoadStatus } from './../app-service/wallet.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppRoutes } from '../constant/routes';


@Component({
  selector: 'app-platform-wallet',
  templateUrl: './platform-wallet.component.html',
  // styleUrls: ['./platform-wallet.component.scss']
})
export class PlatformWalletComponent implements OnInit {


  @Input() type: string;
  platformWalletOpen = false;

  platformWallet = [];

  @Output() transInEvt = new EventEmitter();
  $data;

  constructor(
    private walletService: WalletService
  ) {


    this.$data = this.walletService
      .getMultiPlatforms2()
      .subscribe((res) => {

        // console.log('PlatformWalletComponent getMultiPlatforms res', res);

        this.platformWallet = res;

      });


  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

    this.$data.unsubscribe();

  }

  walletOpen(): void {
    this.platformWalletOpen = !this.platformWalletOpen;
  }

  transinAll(item): void {
    this.transInEvt.emit(item);
  }
}
