import { UtilService } from './../app-service/util.service';
import { tabs } from './../letter/letter.component';
import { PublicService } from './../app-service/public.service';
import { AuthService } from './../app-service/auth.service';
import { LangService } from './../app-service/lang.service';
import { ToastService } from './../app-service/toast.service';
import { AppRoutes } from './../constant/routes';
import { Router } from '@angular/router';
import { WalletService, buyResponse } from './../app-service/wallet.service';
import { Component, OnInit } from '@angular/core';

enum Tabs {
  ALL = 'all',
  // before = 'before',
  // after = 'after',
  // fixed = 'fixed',
  // percent = 'percent',
  // stages = 'stages',
}

enum Activity_type {
  fixed = 'fixed',
  percent = 'percent',
}

@Component({
  selector: 'app-quest-center',
  templateUrl: './quest-center.component.html',
  // styleUrls: ['./quest-center.component.scss']
})
export class QuestCenterComponent implements OnInit {
  Activity_type = Activity_type;
  public tabs: any = Tabs;
  public selected: any;
  public listData: any;

  public pageConfig: {
    itemsPerPage: number,
    currentPage: number,
    totalItems: number
  } = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: 0,
    };

  public questData: any[] | null = null;

  url;
  AppRoutes = AppRoutes;

  questTypes = [];
  quest_method;

  constructor(
    private walletService: WalletService,
    private publicService: PublicService,
    private router: Router,
    private toast: ToastService,
    private langService: LangService,
    private auth: AuthService
  ) {
    // console.log(this.router.url);
    this.url = this.router.url.split('/')[1];

    this.langService.onloadSub.subscribe((boo) => {
      if (boo) {

        this.init();
      }
    });
  }

  init() {

    this.publicService.getQuestGroupList()
      .subscribe((res: any) => {

        // console.log('getQuestGroupList res', res);
        this.questTypes = res.data.content;

        this.getList(Tabs.ALL);

      });

  }


  ngOnInit(): void {
  }

  getActivityWallet(): void {
    this.walletService.getActivityWallet().subscribe((res) => {
      // console.log('getActivityWallet', res);
      this.listData = res.data.products;
    });
  }

  initQuest(): void {

    const tmpPagin: any = {
      page: this.pageConfig.currentPage,
      perPage: this.pageConfig.itemsPerPage
    };

    // console.log('selected', this.selected);

    if (this.selected == Tabs.ALL) {

    } else {
      tmpPagin.groupId = this.selected;
    }


    this.publicService.getPublicQuestList(tmpPagin)
      .subscribe((response) => {
        // let questList = response.data.content;
        let questList = [];
        response.data.content.forEach((item) => {
          questList.push({
            name: item.name,
            startAt: item.startTime,
            endAt: item.endTime,
            information: item.information,
            image: item.imageUrl,
            informationDisplay: item.informationDisplay,
            method: item.method,
            type: item.type,
          });
        });

        this.pageConfig.totalItems = response.data.total;
        this.pageConfig.itemsPerPage = response.data.perPage;
        this.pageConfig.currentPage = response.data.page;

        this.listData = questList;
      });

  }

  selectType(t: Tabs): void {

    this.questData = null;
    this.pageConfig.currentPage = 1;
    this.getList(t);
  }

  getList(t: Tabs = null) {
    switch (this.url) {
      case AppRoutes.Activity_Wallet:
        this.getActivityWallet();

        break;

      case AppRoutes.QUEST:

        if (t) {
          this.selected = t;
        }

        this.initQuest();

        break;
    }
  }

  pageChanged(event): void {
    this.pageConfig.currentPage = event;
    UtilService.toTop();
    this.getList();
  }

  getDetail(data: any): void {
    // console.log('getDetail', data);
    this.questData = data;
    UtilService.toTop();
  }

  buy(item): void {
    if (this.auth.user.money < item.price) {
      this.toast.error(
        this.langService.translations.QUEST_CENTER.buy_moneyNotEnough
      );
      return;
    }

    if (item.type === Activity_type.fixed) {
      this.walletService.buyActivityWallet(item.id).subscribe(
        (res) => {
          // console.log('res', res);
          this.resHandler(res);
        },
        (err) => {
          // console.log('err', err);
          this.errorHandler(err);
        }
      );
    } else {
      this.toast.buyActivity(
        this.langService.translations.QUEST_CENTER.price_input,
        item.percentMinPrice,
        (input) => {
          // console.log('input', input);
          this.walletService.buyActivityWallet(item.id, input).subscribe(
            (res) => {
              // console.log('res', res);
              this.resHandler(res);
            },
            (err) => {
              // console.log('err', err);
              this.errorHandler(err);
            }
          );
        }
      );
    }
  }

  resHandler(res): void {
    if (res.result) {
      const result = String(res.result);
      switch (res.result) {
        case buyResponse.ok:


          if (res.isAutoPass) {

            this.toast.error(
              this.langService.translations.QUEST_CENTER.buy_success
            );

          } else {

            this.toast.error(
              this.langService.translations.QUEST_CENTER.review
            );

          }

          break;
        case buyResponse.exceedNum:
          this.toast.error(
            this.langService.translations.QUEST_CENTER.buy_exceedNum
          );
          break;
        case buyResponse.moneyNotEnough:
          this.toast.error(
            this.langService.translations.QUEST_CENTER.buy_moneyNotEnough
          );
          break;
        case buyResponse.noProd:
          this.toast.error(
            this.langService.translations.QUEST_CENTER.buy_noProd
          );
          break;
      }

      this.getActivityWallet();
    }
  }

  errorHandler(err): void {

    // console.log('errorHandler err', err);


    if (err.error.message) {
      this.toast.error(err.error.message);
    } else {
      this.toast.error(err.message);
    }
  }
}
