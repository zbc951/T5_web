import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { AppRoutes } from './../constant/routes';
import { LangService } from './lang.service';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { PublicService, IGame, GameTypeKey } from './public.service';
import { ApiPath } from '../constant/api';
import { WalletService } from './wallet.service';
import { GametagsPipe } from '../gametags.pipe';
import config from '../../config';

export enum EnumGameTag {
  all = 'all',
  hot = 'hot',
  fav = 'fav',
}
interface GameWindowItem {
  platformId: number; // platform id
  window: Window;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  gameWindow: GameWindowItem[] = [];
  transitionData: {
    pkey?,
    pid?,
    game?,
    pname?
  } = {};

  cutToPlatformSubject5 = new BehaviorSubject({});

  _nowPlatform: any = '';

  constructor(
    private walletService: WalletService,
    private publicService: PublicService,
    private auth: AuthService,
    private langService: LangService,
    private toast: ToastService,
    private router: Router
  ) {

    window.onbeforeunload = () => {
      this.closeGame();
    };

  }

  // launchGame(game: any, free = false): void {
  //   // console.log(this.launchGame.caller);

  //   console.log('launchGame', game);
  //   const url = `${ApiPath.ApiMemberGameLaunchGame}?id=${game.id}&free=${free}&platformId=${game.platformId}`;

  //   this.closeGame(game);

  //   this.gameWindow.push({
  //     platformId: game.platformId,
  //     window: window.open(url, '', ''),
  //   });

  //   this.transitionData = null;
  // }


  set nowPlatform(pkey) {

    this._nowPlatform = pkey;
    localStorage.setItem('_nowPlatform', pkey);

  }

  get nowPlatform() {

    return this._nowPlatform || localStorage.getItem('_nowPlatform');

  }

  launchGame2(gamedata, free = false): void {

    console.log('launchGame2', gamedata);

    if (!gamedata.pkey) {
      // this.launchGame(gamedata, gamedata.purchaseLogId);

    } else {

      const game = gamedata.game;

      if (!game) {
        console.log('err');
        return;
      }

      // console.log(this.walletService.multiWalletPlatforms);
      const flatforms = this.walletService.multiWalletPlatforms;

      if (!flatforms) {
        return;
      }

      const multiWalletKeys = flatforms.map((p) => {
        return p.id;
      });

      console.log('multiWalletKeys', multiWalletKeys, game);

      if (multiWalletKeys.includes(game.platformId)) {

        // const url = `${ApiPath.ApiWalletGetwallet}/${gamedata.pkey}/4?gameId=${game.id}&device=PC&platformId=${game.platformId}`;
        let url;
        if (gamedata.purchaseLogId) {

          url = `${ApiPath.ApiWalletGetwallet}/${gamedata.pkey}/4?gameId=${game.id}&device=PC&platformId=${game.platformId}&purchaseLogId=${gamedata.purchaseLogId}`;
        } else {

          url = `${ApiPath.ApiWalletGetwallet}/${gamedata.pkey}/4?gameId=${game.id}&device=PC&platformId=${game.platformId}`;
        }

        this.closeGame(game);
        this.gameWindow.push({
          platformId: game.platformId,
          window: window.open(config.Api.host + url, '', ''),
        });

      } else {

        // this.launchGame(game, gamedata.purchaseLogId);
      }

    }

  }

  closeGame(game?: IGame): void | boolean {

    if (!game) {

      this.gameWindow.forEach(gw => gw.window.close());
      this.gameWindow = [];

    } else {

      this.gameWindow = this.gameWindow.filter(gw => {
        if (gw.platformId === game.platformId) {
          gw.window.close();
          return false;
        }
        return true;
      });

    }

  }

  clickGame(item, gametype): void {
    console.log('clickGame', item, 'gametype', gametype);

    const isLogin = this.auth.user;

    if (!isLogin) {
      this.toast.error(this.langService.translations.loginFirst);
      return;
    }

    if (!item) {
      this.toast.error('not exists game');
      return;
    }

    let key;

    switch (gametype) {

      case GameTypeKey.Slot:
      case GameTypeKey.Fishing:
      case GameTypeKey.Board:

        key = this.publicService.getPkey(gametype, item.platformId);
        this.transitionData =
        {
          pkey: key,
          pid: item.platformId,
          game: item,
          pname: (item.code) ? this.publicService.getPname(item.platformId) : item.name
        };

        this.openTransferWallet();
        break;

      case GameTypeKey.Sport:
      case GameTypeKey.Lottery:
      case GameTypeKey.Live:

        // console.log('**', item);

        if (item.code) {

          // 從 平台頁 #/platform 帶過來是 game
          // 由 'code' 判斷

          key = this.publicService.getPkey(gametype, item.platformId);
          this.transitionData = {
            pkey: key,
            pid: item.platformId,
            game: item,
            pname: this.publicService.getPname(item.platformId)
          };

        } else {

          const tmpgame = item.games.find((g) => {

            return g.type == gametype;

          });

          // console.log('tmpgame', tmpgame);

          this.transitionData = {
            pkey: item.key,
            pid: item.id,
            game: tmpgame,
            pname: item.name
          };

        }

        this.openTransferWallet();

        break;
    }

  }

  openTransferWallet(): void {
    this.router.navigate([{ outlets: { popup: [AppRoutes.TRANSPOPUP] } }]);
  }

}
