import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GameService } from './../app-service/game.service';
import { LangService } from './../app-service/lang.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AppRoutes } from './../constant/routes';
import { PublicService, GameTypeKey } from './../app-service/public.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  // styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // types = [];
  GameTypeKey = GameTypeKey;
  AppRoutes = AppRoutes;

  platforms = [];

  constructor(
    private publicService: PublicService,
    private translate: TranslateService,
    private langService: LangService,
    private gameService: GameService,
    private router: Router
  ) {


    const imgMap = {
      [GameTypeKey.Sport]: 'sports.png',
      [GameTypeKey.Live]: 'live.png',
      [GameTypeKey.Slot]: 'slot.png',
      [GameTypeKey.Lottery]: 'lottery.png',
      [GameTypeKey.Fishing]: 'fish.png',
      [GameTypeKey.Board]: 'board.png',
    };

    const routerMap = {
      [GameTypeKey.Sport]: AppRoutes.SPORT,
      [GameTypeKey.Live]: AppRoutes.LIVE,
      [GameTypeKey.Slot]: AppRoutes.SlotCenter,
      [GameTypeKey.Lottery]: AppRoutes.LOTTO,
      [GameTypeKey.Fishing]: AppRoutes.FISH,
      [GameTypeKey.Board]: AppRoutes.BOARD
    };

    this.langService.onloadSub
      .subscribe((boo) => {
        if (boo) {

          const { translations } = this.langService;
          // this.publicService.getTypeMenu()
          //   .subscribe((res) => {

          //     // console.log('res', res);

          //     res.forEach((typeObj) => {
          //       const { type } = typeObj;
          //       // typeObj.tname = translations.HEADER_NAV[type];
          //       typeObj.img = `/au8_web/assets/img/types/${imgMap[type]}`;
          //       typeObj.route = `/${routerMap[type]}`;
          //     });

          //     const typeKeys = Object.keys(routerMap);
          //     const tmp = res.filter((t) => {

          //       return typeKeys.includes(t.type);
          //     });

          //     this.types = tmp;

          //   });

          this.publicService.getPlatforms()
            .pipe(
              filter((res: any) => {
                // console.log('res **', res);
                return res.platforms && res.platforms.length > 0;
              })
            )
            .subscribe((res: any) => {

              // console.log('res', res);
              res.platforms.forEach((p) => {
                p.tmpkey = String(p.key).toLowerCase();
              });
              this.platforms = res.platforms;

            });

        }

      });
  }

  ngOnInit(): void {

    // this.types = this.publicService.gametypes;
    this.gameService.cutToPlatformSubject5.next({});
    // console.log('types', this.types);

  }

  goGamepage(platform) {

    console.log('goGamepage', platform);

    const tmpGame = platform.games[0];

    if ([
      GameTypeKey.Sport,
      GameTypeKey.Live,
      GameTypeKey.Lottery
    ].includes(tmpGame.type)) {

      this.gameService.clickGame(platform, tmpGame.type);
      return;
    }

    // this.gameService.nowPlatform = pOrT;

    // return;

    this.gameService.nowPlatform = platform.key;

    this.router.navigateByUrl(AppRoutes.PLATFORM);

  }

}
