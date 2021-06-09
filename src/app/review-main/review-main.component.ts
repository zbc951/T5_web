import { PublicService } from './../app-service/public.service';
import { AppRoutes } from './../constant/routes';
import { Router } from '@angular/router';
import { tabs } from './../letter/letter.component';
import { LogService, reviewType } from './../app-service/log.service';
import { Component, OnInit } from '@angular/core';

enum Tabs {
  // DEPOSIT,
  // BONUS,
  WALLET,
  TRANSFER,
  AmountRecord
}
@Component({
  selector: 'app-review-main',
  templateUrl: './review-main.component.html',
  // styleUrls: ['./review-main.component.scss']
})
export class ReviewMainComponent implements OnInit {

  AppRoutes = AppRoutes;
  tabs: any = Tabs;
  selected: Tabs;
  path;

  constructor(
    private route: Router,
    private logService: LogService,
    private publicService: PublicService
  ) { }

  ngOnInit(): void {

    this.path = this.route.url.split('/')[1];
    // console.log('path', this.path);

    switch (this.path) {

      case AppRoutes.REVIEW_ACTIVITY:
        this.selected = Tabs.WALLET
        break;

      case AppRoutes.REVIEW_MAIN:

        if (this.publicService.chkAmountFromWithdraw) {

          this.selected = Tabs.AmountRecord;
          this.publicService.chkAmountFromWithdraw = false;

        } else {
          this.selected = Tabs.TRANSFER;
        }

        break;

    }

    // const type = this.logService.type;
    // console.log('type', this.logService.type);
  }

  selectType(t: Tabs): void {
    this.selected = t;
  }
}
