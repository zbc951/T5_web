import { Platform } from './../slot-center/slot-center.component';
import { EventService } from './../app-service/event.service';
import { GameService } from './../app-service/game.service';
import { ToastService } from './../app-service/toast.service';
import { PublicService, GameTypeKey } from './../app-service/public.service';
import { AuthService } from './../app-service/auth.service';
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LangService } from './../app-service/lang.service';
import { AppRoutes } from '../constant/routes';
import { MaintainService } from '../app-service/maintain.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  // styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  url;
  showItems = [];
  isLogin = false;
  tmpPlatforms;
  tmpgameType;

  // routerEventsListener;
  translations;
  gameType = {
    url: '',
    adPhoto: '',
    title_big: '',
    title_small: '',
    discription: ''
  };

  partners;
  // partnersList;
  partnersWidth;
  partnersImgnum;
  partnersX = 0;
  gamelistX = 0;
  AppRoutes = AppRoutes;
  routesTypeMap = {
    [AppRoutes.SPORT]: GameTypeKey.Sport,
    [AppRoutes.LIVE]: GameTypeKey.Live,
    [AppRoutes.SLOT]: GameTypeKey.Slot,
    [AppRoutes.LOTTO]: GameTypeKey.Lottery,
    [AppRoutes.FISH]: GameTypeKey.Fishing,
    [AppRoutes.BOARD]: GameTypeKey.Board
  };

  @ViewChild('partnersList') partnersList: ElementRef;
  // @ViewChild('gamesList') gamesList: ElementRef;

  itemsPerpage = 8;
  page = 0;
  pages = 0;
  itemInRowRange;

  constructor(
    private router: Router,
    private langService: LangService,
    private auth: AuthService,
    private publicService: PublicService,
    private toast: ToastService,
    private gameService: GameService,
    private maintainService: MaintainService

  ) {

    this.url = this.router.url.split('/')[1];
    this.tmpgameType = this.routesTypeMap[this.url];

    this.langService.onloadSub
      .subscribe((boo) => {

        if (boo) {
          this.setTxt(this.langService.translations,
            this.router.url.split('/')[1]);

          this.publicService.getPlatforms()
            .subscribe((res) => {

              if (!res || res.length == 0) {
                return;
              }

              this.init();

            });


        }
      });

    this.auth.isLogin()
      .subscribe((res) => {
        this.isLogin = res;
      });
  }

  ngOnInit(): void {
  }

  init() {

    switch (this.url) {
      case AppRoutes.SPORT:

        this.showItems = this.publicService.getShowItems(GameTypeKey.Sport);
        // console.log('showItems', this.showItems);

        this.gameType.adPhoto = this.showItems[0].pageBgImgUrl;
        this.pages = Math.ceil(this.showItems.length / this.itemsPerpage);
        this.itemInRowRange = Array.from(Array(this.pages).keys());

        break;

      case AppRoutes.LIVE:

        this.showItems = this.publicService.getShowItems(GameTypeKey.Live);
        this.pages = Math.ceil(this.showItems.length / this.itemsPerpage);
        this.itemInRowRange = Array.from(Array(this.pages).keys());
        this.gameType.adPhoto = this.showItems[0].pageBgImgUrl;
        console.log('live', this.showItems);

        break;

      case AppRoutes.SLOT:
        this.showItems = this.publicService.getShowItems(GameTypeKey.Slot);
        break;

      case AppRoutes.LOTTO:
        this.showItems = this.publicService.getShowItems(GameTypeKey.Lottery);
        this.pages = Math.ceil(this.showItems.length / this.itemsPerpage);
        this.itemInRowRange = Array.from(Array(this.pages).keys());

        break;

      case AppRoutes.FISH:
        this.gameService.nowPlatform = '';
        this.showItems = this.publicService.getShowItems(GameTypeKey.Fishing);
        break;

      case AppRoutes.BOARD:
        this.gameService.nowPlatform = '';
        this.showItems = this.publicService.getShowItems(GameTypeKey.Board);
        break;
      case AppRoutes.PLATFORM:

        const pkey = this.gameService.nowPlatform;
        // console.log('pkey', pkey);
        this.showItems = this.publicService.getGameItemsByPlatform(pkey);

        // console.log('showItems', this.showItems);

        break;

    }


    // this.maintainService.parse(this.url, this.showItems);
    // console.log('showItems', this.showItems);

    this.partnersImgnum = this.showItems.length;
    this.partnersWidth = this.partnersImgnum * 602;
  }


  // ngOnDestroy() {
  //   this.routerEventsListener.unsubscribe();
  // }

  setTxt(translations: any, url: string): void {

    this.translations = translations;
    console.log('url', url);
    switch (url) {

      case 'live':
        this.gameType.url = url;
        this.gameType.adPhoto = `assets/img/${this.gameType.url}.png`;
        this.gameType.title_big = this.langService.translations.GAMETYPE.LIVE;
        this.gameType.title_small = 'LIVE CASINO';
        this.gameType.discription = this.langService.translations.GAMETYPE.DISCRIPTION.LIVE;
        break;
      case 'sport':
        this.gameType.url = url;
        this.gameType.adPhoto = `assets/img/${this.gameType.url}.png`;
        this.gameType.title_big = this.langService.translations.GAMETYPE.SPORT;
        this.gameType.title_small = 'SPORT GAMES';
        this.gameType.discription = this.langService.translations.GAMETYPE.DISCRIPTION.SPORT;
        break;
      case 'lotto':
        this.gameType.url = url;
        this.gameType.adPhoto = `assets/img/${this.gameType.url}.png`;
        this.gameType.title_big = this.langService.translations.GAMETYPE.LOTTO;
        this.gameType.title_small = 'LOTTERY GAMES';
        this.gameType.discription = this.langService.translations.GAMETYPE.DISCRIPTION.LOTTO;
        break;
      case 'fish':
        this.gameType.url = url;
        this.gameType.adPhoto = `assets/img/${this.gameType.url}.png`;
        this.gameType.title_big = this.langService.translations.GAMETYPE.FISH;
        this.gameType.title_small = 'FISHING GAMES';
        this.gameType.discription = this.langService.translations.GAMETYPE.DISCRIPTION.FISH;
        break;
      case 'board':
        this.gameType.url = url;
        this.gameType.adPhoto = `assets/img/${this.gameType.url}.png`;
        this.gameType.title_big = this.langService.translations.GAMETYPE.CASUAL;
        this.gameType.title_small = 'CHESS GAMES';
        this.gameType.discription = this.langService.translations.GAMETYPE.DISCRIPTION.BORAD;

      case 'platform':
        this.gameType.url = url;
        break;
    }
  }

  openTransferWallet(): void {
    this.router.navigate([{ outlets: { popup: [AppRoutes.TRANSPOPUP] } }]);
  }

  click(item): void {
    console.log('click', item);
    console.log(this.gameType);

    if (item.maintain) {
      return;
    }

    if (this.maintainService.checkIsRoutineMaintainIng(item)) {
      return;
    }

    this.gameService.clickGame(item, this.tmpgameType);

  }


  hover(item) {

    if (
      this.gameType.url == AppRoutes.SPORT ||
      this.gameType.url == AppRoutes.LIVE ||
      this.gameType.url == AppRoutes.LOTTO) {

      // console.log(item.key);

      this.gameType.adPhoto = item.pageBgImgUrl;
    }

  }

}
