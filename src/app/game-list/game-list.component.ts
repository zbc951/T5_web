import { AuthService } from './../app-service/auth.service';
import { PublicService, GameTypeKey, IGame } from './../app-service/public.service';
import { GameService, EnumGameTag } from './../app-service/game.service';
import { FavoriteService } from './../app-service/favorite.service';
import { LangService } from './../app-service/lang.service';
import { ToastService } from './../app-service/toast.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  // styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {

  isLogin;
  enumGameTags = EnumGameTag;
  gameTag: EnumGameTag = this.enumGameTags.all;
  tagsMap: any = {};
  favorites = [];
  pkey;

  @Input() showItems = [];


  constructor(
    private publicService: PublicService,
    private toast: ToastService,
    private gameService: GameService,
    private langService: LangService,
    private favoriteService: FavoriteService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {

    this.pkey = String(this.gameService.nowPlatform).toLowerCase();


    console.log('showItems', this.showItems);
    this.showItems.forEach((game) => {


      // console.log('game', game.tags);

      if (game.tags.length > 0) {

        game.tags.forEach((item) => {

          // console.log('item.tag', item.tag);
          if (item.tag !== EnumGameTag.hot) {

            this.tagsMap[item.tag] = item.name;
          }
        });
      }

    });

    this.favoriteService.getData()
      .subscribe((res) => {

        console.log('favoriteService.getData', res);

        this.favorites = res;
      });

    this.auth.isLogin()
      .subscribe((res) => {
        this.isLogin = res;
      });

  }

  changeGameTag(tag: EnumGameTag): void {

    if (this.gameTag == tag) {
      return;
    }

    this.gameTag = tag;

    console.log('changeGameTag tag', tag, this.gameTag);

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
        // 真正的 tags 由  pipe 處理就好
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

    // console.log('clickGame game', game);


    if (evt.target.tagName === 'BUTTON') {
      return;
    }


    if (!this.isLogin) {
      this.toast.error(this.langService.translations.loginFirst);
      return;
    }

    if (game.maintain) {

      return;

    }


    this.gameService.clickGame(game, game.type);

  }



}
