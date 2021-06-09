import { filter } from 'rxjs/operators';
import { MaintainService } from './../app-service/maintain.service';
import { GametagsPipe } from './../gametags.pipe';
import { FormControl } from '@angular/forms';
import { AuthService } from './../app-service/auth.service';
import { FavoriteService } from './../app-service/favorite.service';
import { LangService } from './../app-service/lang.service';
import { GameService, EnumGameTag } from './../app-service/game.service';
import { ToastService } from './../app-service/toast.service';
import { PublicService, GameTypeKey, IGame } from './../app-service/public.service';
import { Component, OnInit } from '@angular/core';
import { SearchGamePipe } from '../search-game.pipe';
import { Router } from '@angular/router';
import { AppRoutes } from '../constant/routes';

export enum Platform {
  Bng = 'bng',
  Ka = 'ka',
  Ds = 'ds',
  Ifun = 'ifun',
  Pls = 'pls',
}

@Component({
  selector: 'app-slot-center',
  templateUrl: './slot-center.component.html',
  // styleUrls: ['./slot-center.component.scss']
})
export class SlotCenterComponent implements OnInit {

  url;
  gameType;

  public platforms: any = [];
  public displayInside = false;
  public games: any = [];
  public pageConfig: any = {
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: this.games.count,
  };


  // ==============================
  enumGameTags = EnumGameTag;
  allShowItems = [];
  showItems = [];
  tmpPlatform;
  favorites = [];
  isLogin;
  gameTag: EnumGameTag = this.enumGameTags.all;
  tagsMap: any = {};

  searchCtrl: FormControl = new FormControl('');

  constructor(
    private publicService: PublicService,
    private toast: ToastService,
    private gameService: GameService,
    private langService: LangService,
    private favoriteService: FavoriteService,
    private auth: AuthService,
    private gametagsPipe: GametagsPipe,
    private searchGamePipe: SearchGamePipe,
    private maintainService: MaintainService,
    private router: Router,
  ) {

    this.url = this.router.url.split('/')[1];

    if (this.url == AppRoutes.BOARD) {
      this.gameType = GameTypeKey.Board;
    } else if (this.url == AppRoutes.SlotCenter) {
      this.gameType = GameTypeKey.Slot;
    } else if (this.url == AppRoutes.FISH) {
      this.gameType = GameTypeKey.Fishing;
    }

    this.langService.onloadSub
      .subscribe((boo) => {

        if (boo) {
          this.init();
        }

      });
    ;

    this.searchCtrl.valueChanges
      .subscribe((input) => {

        // console.log('input', input);

        this.filter();

      });
  }


  ngOnInit(): void {
  }

  init() {

    this.displayInside = false;

    this.publicService.getPlatforms()
      .pipe(
        filter((res: any) => {
          // console.log('res **', res);
          return res.platforms && res.platforms.length > 0;
        })
      )
      .subscribe((res) => {

        // console.log('res !!', res);

        this.showItems = JSON.parse(JSON.stringify(this.publicService.getShowItems(this.gameType)));
        console.log('showItems', this.showItems);

        this.showItems.forEach((p) => {

          const tmpGames = [];

          p.games.forEach((game) => {

            if (game.type == this.gameType) {
              tmpGames.push(game);
            }

          });

          p.games = tmpGames;

        });

        // console.log('showItems', this.showItems);
        this.allShowItems = this.showItems.slice();

        this.showItems.forEach((platform) => {

          platform.img = platform.key.toLowerCase();

          platform.games.forEach((game) => {
            if (game.tags.length > 0) {

              game.tags.forEach((item) => {

                // console.log('item.tag', item.tag);
                if (item.tag !== EnumGameTag.hot) {

                  this.tagsMap[item.tag] = item.name;
                }
              });
            }
          });
        });

      });

    this.favoriteService.getData()
      .subscribe((res) => {
        this.favorites = res;
      });

    this.auth.isLogin()
      .subscribe((res) => {
        this.isLogin = res;
      });


    this.gameService.cutToPlatformSubject5.subscribe((res) => {

      // console.log('cutToPlatformSubject5 res', res);

      if (Object.keys(res).length > 0) {

        this.moreGames(res);

        window.scrollTo({
          top: 500,
          left: 0,
          behavior: 'smooth'
        });
      }

    });
  }


  moreGames(platform): void {

    console.log('moreGames', platform);
    platform.img = platform.key.toLowerCase();
    this.clearSearch();

    this.gameTag = this.enumGameTags.all;
    this.tmpPlatform = platform;

    // let fish = platform.games.filter(item=>{return item.type=='fishing'})
    // console.log('找item type',fish)

    // for(let i = 0; i < platform.games.length; i++) {
    //   if(this.gameType == 'fishing') {
    //     platform.games = fish
    //     this.showItems = [platform]
    //   }
    // }

    this.showItems = [platform]

    this.displayInside = true;

  }

  back(): void {
    this.clearSearch();
    this.gameTag = this.enumGameTags.all;
    this.tmpPlatform = null;
    this.showItems = this.allShowItems;
    this.displayInside = false;
  }

  clearSearch() {
    if (this.searchCtrl.value) {
      this.searchCtrl.patchValue('');

    }
  }

  pageChanged(event): void {
    this.pageConfig.currentPage = event;
  }

  changeGameTag(tag: EnumGameTag): void {

    if (this.gameTag == tag) {
      return;
    }

    this.gameTag = tag;

    console.log('changeGameTag tag', tag, this.gameTag);

    if (this.displayInside) {

      this.showItems = [this.tmpPlatform];

    } else {

      this.showItems = this.publicService.getShowItems(this.gameType);

    }

    switch (tag) {
      case EnumGameTag.all:

        if (this.isLogin) {
          this.favoriteService.all();
        }

        break;

      case EnumGameTag.fav:

        if (!this.isLogin) {

          // this.toast.error(this.loginFirstTxt);
          this.toast.error(this.langService.translations.loginFirst);
        }

      default:
        this.filter();
        break;
    }
  }

  favClick(gameId): void {
    if (!this.isLogin) {
      // this.toast.error(this.loginFirstTxt);
      this.toast.error(this.langService.translations.loginFirst);
      return;
    }

    const game = this.favorites.find((item) => {
      return item === gameId;
    });

    if (game) {
      this.favoriteService.remove(gameId);
    } else {
      this.favoriteService.add(gameId);
    }

  }

  isFav(gameId): boolean {

    return this.favorites.includes(gameId);

  }

  clickGame(game: IGame, evt): void {

    // console.log('evt', evt, evt.target, evt.currentTarget);

    // console.log('game', game);

    if (evt.target.tagName === 'BUTTON') {
      return;
    }


    if (!this.isLogin) {
      this.toast.error(this.langService.translations.loginFirst);
      return;
    }

    this.gameService.clickGame(game, this.gameType);

  }

  filter() {

    let copy;

    if (this.displayInside) {
      copy = this.showItems.slice();
    } else {

      copy = this.allShowItems.slice();
    }

    let tmpShowItems = [];

    // console.log('copy', copy);


    copy.forEach((p) => {


      // console.log('p', p);


      let tmp = this.gametagsPipe.transform(p.games, this.gameTag, this.favorites);
      // console.log(p.key, p, 'games', tmp, tmp.length);
      tmp = this.searchGamePipe.transform(tmp, this.searchCtrl.value);
      // console.log('this.searchCtrl.value', this.searchCtrl.value, tmp);


      if (tmp.length > 0) {

        tmpShowItems.push(p);

      }

    });

    this.showItems = tmpShowItems;
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    // this.$data.unsubscribe();

  }

}
