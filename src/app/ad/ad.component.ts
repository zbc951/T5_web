import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PublicService, IGame } from '../app-service/public.service';
import { ToastService } from '../app-service/toast.service';
import { AuthService } from '../app-service/auth.service';
import { GameService } from '../app-service/game.service';
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

import loopConfig from '../../config';
import config from '../../config';

enum CarouselPosition {
  WebHome = 'web-home',
  WebSlot = 'web-slot',
  MobileHome = 'mobile-home',
  MobileSlot = 'mobile-slot',
}

interface ICarouselImage {
  name: string;
  imageUrl: string;
  linkType: CarouselLinkType;
  platformId: number;
  gameId: number;
  couponId: number;
  linkUrl: string;
  order: number;
  startTime: string;
  endTime: string;
  visible: boolean;
}

enum CarouselLinkType {
  None = 'none',
  Game = 'game',
  Coupon = 'coupon',
  link = 'link',
}

@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  // styleUrls: ['./ad.component.scss']
  providers: [NgbCarouselConfig]
})
export class AdComponent implements OnInit {

  carousels = [];

  loginFirstTxt = '';
  // index = 0;
  // pages = 0;
  // perpage = 1;
  // needPagin = true;
  // isGlow = false;

  // loopId;
  // loopConfig = {
  //   isLoop: false,
  //   loopMs: 3000
  // };

  // @ViewChild('ad', { static: false }) adRef: ElementRef;

  constructor(
    private publicService: PublicService,
    private toastService: ToastService,
    private auth: AuthService,
    private gameService: GameService,
    private router: Router,
    private translateService: TranslateService,
    config: NgbCarouselConfig
  ) {

    // this.loopConfig = config.loopConfig;

    config.interval = 5000;

    this.translateService.onLangChange
      .subscribe((evt: LangChangeEvent) => {
        const { translations } = evt;
        this.loginFirstTxt = translations.loginFirst;
      });
  }

  ngOnInit() {
    // fake
    // this.carousels = ['','','','',''];
    this.carousels = [
      {
        imageUrl: 'null'
      }
    ]

    this.publicService.getCarousel()
      .subscribe((carousels) => {

        if (carousels.length == 0) {
          return;
        }
        const tmpCarousels: any = carousels
          .find(item => item.position === CarouselPosition.WebHome
          );

        tmpCarousels.images.sort((a, b) => {
          return a.order - b.order;
        });

        this.carousels = tmpCarousels.images;
        // this.pages = Math.ceil(this.carousels.length / this.perpage);

        // if (this.carousels.length > this.perpage) {
        //   this.needPagin = true;

        //   if (this.loopConfig.isLoop) {

        //     this.startLoop();

        //   }

        // }

      });
  }

  // prev() {

  //   this.index--;
  //   // console.log('prev', this.index);

  //   if (this.index >= 0) {

  //     this.updateCarousel();

  //   } else if (this.index < 0) {

  //     this.resetEffect();

  //     this.index = this.pages - 1;
  //     this.adRef.nativeElement.setAttribute('style', `transition:none; transform:translateX(-${this.index * 100}%)`);
  //   }

  // }

  // next() {

  //   if (this.index < this.pages - 1) {

  //     this.index++;
  //     this.updateCarousel();

  //   } else if (this.index === this.pages - 1) {

  //     this.resetEffect();

  //     this.index = 0;

  //     this.adRef.nativeElement.setAttribute('style', `transition:none; transform:translateX(-${this.index * 100}%)`);

  //   }

  //   this.startLoop();
  // }

  // updateCarousel() {
  //   this.adRef.nativeElement.setAttribute('style', `transform:translateX(-${this.index * 100}%)`);
  // }


  // resetEffect() {
  //   this.isGlow = true;

  //   setTimeout(() => {
  //     this.isGlow = false;
  //   }, 1000);
  // }

  clickCarousel(item) {

    const linkType = item.linkType;
    console.log('linkType', linkType);

    switch (linkType) {
      case CarouselLinkType.Game:

        let game: IGame;
        let key;

        const gamePlatforms = this.publicService.platforms.platforms;

        gamePlatforms
          .filter(p => p.id == item.platformId)
          .forEach(p => {
            key = p.key;
            p.games.
              filter(g => g.id == item.gameId).
              forEach(g => {
                game = g;
              });
          });

        this.openGame(
          {
            pkey: key,
            game: game
          });

        break;

      case CarouselLinkType.link:
        location.href = item.linkUrl;
        break;
    }
  }

  openGame(gamedata: { pkey: string, game: IGame }) {
    console.log('gamedata', gamedata);

    if (!gamedata.game) {
      this.toastService.info('not exists game');
      return;
    }

    if (!this.auth.user) {
      this.toastService.error(this.loginFirstTxt, 3000);
      return;
    }

    this.gameService.launchGame2(gamedata);
  }

  // startLoop() {

  //   if (!this.loopConfig.isLoop) {
  //     return;
  //   }

  //   clearInterval(this.loopId);
  //   this.loopId = setInterval(() => {
  //     this.next();

  //   }, this.loopConfig.loopMs);

  // }

}
