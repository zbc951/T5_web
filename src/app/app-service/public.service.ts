import { UtilService } from './util.service';
import { LangService } from './lang.service';
import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import { ApiPath } from 'src/app/constant/api';
import { AuthService } from './auth.service';
import { BehaviorSubject, pipe, Observable } from 'rxjs';
import { ToastService } from './toast.service';
import { tap, share } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppRoutes } from '../constant/routes';
import { SocketService } from './socket.service';

export enum GameTypeKey {
  Slot = 'slot',
  Live = 'live',
  Fishing = 'fishing',
  Lottery = 'lottery',
  Sport = 'sport',
  Video = 'video',
  Poker = 'poker',
  Board = 'board',
}

export interface IResponseUserData {
  user: {
    id: number;
    token: string;
    account: string;
    name: string;
    nickname: string;
    phone: string;
    clubRank: string;
    birth: string;
    wechat: string;
    email: string;
    locked: number;
    money: number;
    bonus: number;
    reviewWithdrawAmount: number;
    //切換 四代
    memberMode: number;
  };
}
export interface IResponseGameType {
  type: string;
  name: string;
}

export interface IGameTypeMenu {
  key: GameTypeKey;
  types: string[];
  name: string;
  platforms: IGamePlatform[];
}
export interface IResponseGame {
  hashCode: string;
  update: boolean;

  platforms: {
    id: number; // number game_platform.id
    key: string; // string 平台縮寫
    name: string; // string 平台名稱
    type: string; // string 平台類型
    order: number; // number 排序
    imageUrl: string; // string 平台圖片路徑
    iconUrl: string; // string 平台 icon 路徑
    maintain: number; // number 是否臨時維修
    maintainCrontab: string; // string 固定維修時間
    maintainMinute: number; // number 固定維修時長
    games: {
      id: number; // number game.id
      code: string; // string 遊戲自訂代碼(編號)
      name: string; // string 遊戲名稱
      type: string; // string 遊戲類型
      order: number; // number 排序
      maintain: number; // number 是否臨時維修
      imageUrl: string; // string 圖片路徑
      tags: {
        tag: string; // string tag 類型
        name: string; // string tag 名稱
      }[];
    }[];
  }[];
}

export interface IGameTag {
  tag: string;
  name: string;
}
export interface IGame {
  id: number; // game.id
  platformId: number; // game_platform.id
  type: string;
  code: string; // 遊戲自訂代碼(編號)
  name: string; // 遊戲名稱
  order: number; // 排序
  maintain: boolean;
  imageUrl: string; // 圖片路徑
  tags: IGameTag[];
  hasFree: boolean; // 免費遊戲
}
export interface IGamePlatform {
  id: number; // game_platform.id
  key: string; // 平台縮寫
  name: string; // 平台名稱
  order: number; // 排序
  imageUrl: string; // 平台圖片路徑
  iconUrl: string;
  maintain: boolean;
  maintainCrontab: string;
  maintainMinute: number;
  games: IGame[];
}

export interface IExists {
  exists: boolean;
}

export interface IResponseRegister {
  review: boolean;
}

export enum MarqueeType {
  Normal = 'normal',
  Hot = 'hot',
  deposit = 'deposit',
}

export enum QUEST_VERSION {
  COMBINE = 'combine',
}

export enum questTabs {
  apply = 'apply',
  recored = 'recored',
  applied = 'applied'
}

@Injectable({
  providedIn: 'root',
})
export class PublicService {

  _isMaintain = false;
  isMaintainSub = new BehaviorSubject(false);

  quest_version;
  withdraw_fee_enbled;

  _isHaveBank;
  isHaveBankSub = new BehaviorSubject(false);


  _isActivityWallet;
  isActivityWalletSub = new BehaviorSubject(false);

  _memberMode = false;
  isMemberModeOnSub = new BehaviorSubject(false);

  platforms;
  gametypes = [];
  typeMenus = [];
  typeMenusSubject = new BehaviorSubject([]);
  platformsSubject = new BehaviorSubject([]);

  // 只能使用查詢功能, 其他禁用, 尤其是 存轉提 相關
  _locked = false;

  marqueesObj: {
    hashCode: string;
    marquees: any[];
    update: boolean;
  } = {
      hashCode: '',
      marquees: [],
      update: false,
    };

  marqueesSubject = new BehaviorSubject([]);

  carouselObj: {
    hashCode: string;
    update: boolean;
    carousels?: any[];
  } = {
      hashCode: '',
      carousels: [],
      update: false,
    };

  carouselSubject = new BehaviorSubject([]);

  forgetPwdLefttime;
  forgetPwdPhone;

  tmpSublink;

  public pageTabLink = new BehaviorSubject('');
  public pageLink = new BehaviorSubject('');

  isFromClickMarquee = false;

  chkAmountFromWithdraw = false;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private toastService: ToastService,
    private router: Router,
    private socketService: SocketService,
    private langService: LangService
  ) {
    this.platforms = JSON.parse(localStorage.getItem(ApiPath.ApiPublicGames));
  }

  set isHaveBank(boo) {
    this._isHaveBank = boo;
    this.isHaveBankSub.next(boo);
  }

  get isHaveBank(): boolean {
    return this._isHaveBank;
  }

  getIsHaveBank() {
    return this.isHaveBankSub.asObservable();
  }

  set isMaintain(boo) {
    this._isMaintain = boo;
    this.isMaintainSub.next(boo);
  }

  get isMaintain(): boolean {
    return this._isMaintain;
  }

  set isActivityWallet(boo: boolean) {
    this._isActivityWallet = boo;
    this.isActivityWalletSub.next(this._isActivityWallet);
  }

  get isActivityWallet(): boolean {
    return this._isActivityWallet;
  }

  set memberMode(nboo: any) {

    this._memberMode = nboo ? true : false;
    this.isMemberModeOnSub.next(this._memberMode);

  }

  get memberMode() {
    return this._memberMode;
  }

  set locked(boo: any) {
    this._locked = boo == 1 ? true : false;
  }

  get locked() {
    return this._locked;
  }


  getIsActivityWallet() {
    return this.isActivityWalletSub.asObservable();
  }


  assignUserData(refresh: IResponseUserData) {
    const { user = null } = refresh;
    if (user) {
      this.auth.user = user;

      // this.games();
      // PublicService.gameTypes();

      if (user.memberMode) {

        this.memberMode = user.memberMode;

      }

      if (user.hasOwnProperty('locked')) {
        this.locked = user.locked;
      }

      this.socketService.connect();
      this.socketService.on('logout', () => {
        this.logout().subscribe();
      });
    } else {
      this.auth.clean();
      this.socketService.disconnect();
    }
  }

  init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(ApiPath.ApiPublicInit).subscribe((res) => {
        // console.log('res', res);
        const refresh = res.refresh || {};
        this.quest_version = refresh.quest_version;
        this.withdraw_fee_enbled = refresh.withdraw_fee_enbled;
        this.isHaveBank = refresh.isHaveBank;
        this.isActivityWallet = refresh.isActivityWallet;
        this.locked = res.refresh.user?.locked;

        this.assignUserData(refresh);
        return resolve(true);
      }, (err) => resolve(false));
    });
  }

  login(formData: { account: string; password: string }) {

    // this.testlogin();

    this.http.post<any>(ApiPath.ApiPublicLogin, formData).subscribe(
      (res) => {

        // this.testlogin();
        // console.log('ApiPublicLogin res ', res);
        this.assignUserData(res.refresh);

        // 將 id 寫道 localstorage
        localStorage.setItem('userId', res.refresh.user.id);
        // this.router.navigateByUrl(AppRoutes.HOME);

        setTimeout(() => {
          // this.router.navigate([{ outlets: { popup: [AppRoutes.BULLETIN] } }]);
          this.openBulletin();

          // 登入後再撈一次使用者可用的平台
          this.games();

        }, 500);
      },
      (err) => {
        // console.log('err.message', err.error);
        if (err.error.errors) {

          const msg = UtilService.contactErrMsg(err.error.errors);

          if (msg) {
            this.toastService.error(msg);
            return;

          }
        }

        this.toastService.error(err.error.message);
      }
    );
  }

  testlogin() {
    this.http.get('/api/omg').subscribe((res) => {
      console.log('logintest res', res);
    });
  }

  logout() {

    return this.http.get(ApiPath.ApiPublicLogout).pipe(
      tap(() => {
        this.auth.clean();
        this.socketService.disconnect();
        this.router.navigateByUrl(AppRoutes.HOME);
        // this.games();
        // PublicService.gameTypes();
      })
    );
  }

  register = (formData) => {
    return this.http.post<any>(ApiPath.ApiPublicRegister, formData);
  };

  games() {
    // let { hashCode = null } = this.gamePlatforms.data || {};
    let { hashCode = null } = this.platforms || {};

    this.http.get<any>(ApiPath.ApiPublicGames).subscribe((res) => {
      // console.log('res', res);
      const { data } = res;
      if (data.update) {
        this.platforms = {
          hashCode: data.hashCode,
          platforms: data.platforms.map((platform) => ({
            ...platform,
            maintain: platform.maintain === 1,
            games: platform.games.map((game) => ({
              ...game,
              hasFree: game.tags.some((t) => t.tag === 'free'),
              platformId: platform.id,
              maintain: game.maintain === 1,
            })),
          })),
        };

        // console.log('platforms', this.platforms);
        localStorage.setItem(
          ApiPath.ApiPublicGames,
          JSON.stringify(this.platforms)
        );
        this.platformsSubject.next(this.platforms);

        this.updateGameGroup();
      }
    });
  }

  getPlatforms() {
    return this.platformsSubject.asObservable().pipe(share());
  }

  gameTypes() {
    const typeGroup = [
      { key: GameTypeKey.Slot, types: ['slot'] },
      { key: GameTypeKey.Live, types: ['live'] },
      { key: GameTypeKey.Lottery, types: ['lottery'] },
      { key: GameTypeKey.Sport, types: ['sport'] },
      { key: GameTypeKey.Fishing, types: ['fishing'] },
      { key: GameTypeKey.Board, types: ['board'] },
    ];

    this.http.get<any>(ApiPath.ApiPublicGameTypes).subscribe((res) => {
      // console.log('ApiPublicGameTypes res', res);

      const gametypes: IResponseGameType[] = res.data || [];
      let typeMenus: IGameTypeMenu[] = [];
      this.gametypes = gametypes;
      this.typeMenusSubject.next(res.data);
    });
  }

  getTypeMenu() {
    return this.typeMenusSubject.asObservable().pipe(share());
  }

  getShowItems(type) {
    switch (type) {
      case GameTypeKey.Sport:
      case GameTypeKey.Live:
      case GameTypeKey.Slot:
      case GameTypeKey.Lottery:
      case GameTypeKey.Board:
      case GameTypeKey.Fishing:
        return this.getPlatFormItems(type);
    }
  }

  getPlatFormItems(gametype = null) {

    // console.log('getPlatFormItems');

    const platforms = this.platforms.platforms;


    if (!gametype) {
      // 回傳 不分類型
      return platforms;
    }

    // console.log('platforms', platforms);
    const items = platforms.filter((p) => {

      // 找平台下面有遊戲 是 屬於 該類型 就回傳該平台
      const tmptmp = p.games.find((game) => {
        return game.type === gametype;
      });

      // console.log('tmptmp', tmptmp);

      if (tmptmp) {
        return p;
      }
    });

    // console.log('items', items);
    return items;
  }

  getGameItems(gametype) {
    const platforms = this.getPlatFormItems(gametype);
    // console.log('getGames platforms', platforms);

    let tmpArr = [];
    platforms.forEach((p) => {
      const pKey = p.key;
      p.games.forEach((item) => item.key = pKey);
      tmpArr.push(p.games);
    });

    const games = this.flatten(tmpArr).filter((game) => {
      return game.type === gametype;
    });

    return games;
  }


  getGameItemsByPlatform(pkey) {

    const platforms = this.platforms.platforms;
    // console.log('getGamesByPlatform platforms', platforms);

    const p = platforms.find((p) => {

      return p.key == pkey;
    });

    return p.games;
  }


  getPkey(gametype, pid) {
    const platforms = this.getPlatFormItems(gametype);
    const p = platforms.find((fp) => {
      return fp.id === pid;
    });
    return p.key;
  }

  getPname(pid) {

    const platforms = this.platforms.platforms;
    const p = platforms.find((fp) => {
      return fp.id === pid;
    });
    return p.name;
  }


  flatten(arr): any[] {
    return arr.reduce((a, b) => {
      return a.concat(Array.isArray(b) ? this.flatten(b) : b);
    }, []);
  }

  updateGameGroup() {
    if (!this.typeMenus.length) {
      return;
    }

    const platformMap: {
      [type: string]: {
        [pid: number]: IGamePlatform;
      };
    } = {};
    const typeMapping = {};
    this.typeMenus.forEach((tm) => {
      tm.types.forEach((type) => {
        typeMapping[type] = tm;
      });
    });

    console.log('typeMenus', this.typeMenus);
    console.log('typeMapping', typeMapping);
  }

  updateCarousel() {
    const params = new HttpParams().set('hashCode', this.carouselObj.hashCode);
    this.http
      .get<any>(ApiPath.ApiPublicCarousel, { params })
      .subscribe((res) => {
        // console.log('ApiPath.ApiPublicCarousel res', res);
        if (res.data.update) {
          this.carouselObj = res.data;
          this.carouselSubject.next(this.carouselObj.carousels);
        }
      });
  }

  getCarousel() {
    return this.carouselSubject.asObservable();
  }

  updateMarquee() {
    const params = new HttpParams().set('hashCode', this.marqueesObj.hashCode);
    this.http
      .get<any>(ApiPath.ApiPublicMarquee, { params })
      .subscribe((res) => {
        // console.log('ApiPath.ApiPublicMarquee res', res);
        if (res.data.update) {
          this.marqueesObj = res.data;
          this.marqueesSubject.next(this.marqueesObj.marquees);
        }
      });
  }

  getMarguee() {
    return this.marqueesSubject.asObservable().pipe(share());
  }

  getMarqueePage(params: { type; page }) {
    return this.http.get<any>(ApiPath.ApiPublicMarqueePage, { params });
  }

  getQuestType() {
    return this.http.get(ApiPath.ApiPublicQuestType).pipe(share());
  }

  getPublicQuestList(pageConfig) {
    const params = UtilService.getHttpParams(pageConfig);
    return this.http.get<any>(ApiPath.ApiPublicQuestList, { params });
  }

  resetPwd_step1(formData: { phone }) {
    return this.http.post(ApiPath.ApiForgetPwd1, formData);
  }

  resetPwd_step2(formData: { phone; captcha; password; confirmPassword }) {
    return this.http.post(ApiPath.ApiForgetPwd2, formData);
  }

  resetPwd_recommit(formData: { phone }) {
    return this.http.post(ApiPath.ApiForgetPwd3, formData);
  }

  openBulletin(): void {
    this.router.navigate([{ outlets: { popup: [AppRoutes.BULLETIN] } }]);
  }

  goQuest(): void {
    // if (!AuthUserNode.get()) {
    //     CommonService.alertError('请先登入', 3000);
    //     return;
    // }

    // this.router.navigateByUrl('/preferential');
    this.router.navigateByUrl(AppRoutes.QUEST);
  }

  goVip(): void {
    if (!this.auth.user) {
      this.toastService.error(this.langService.translations.loginFirst, 3000);
      return;
    }

    this.router.navigateByUrl(AppRoutes.VIP);
  }

  goTeach(): void {
    this.router.navigateByUrl(AppRoutes.HELP);
  }

  // not same as one of memberService
  bindPhone(data: { phone: string }): Observable<any> {
    return this.http.post(ApiPath.ApiTbBindPhone, data);
  }

  goService(url, tab): void {
    this.router.navigateByUrl(url);
    this.pageLink.next(url);
    this.pageTabLink.next(tab);
    this.scrollToTop();
  }

  scrollToTop() {
    (function smoothscroll() {
      var currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    })();
  }

  setGameMaintain(data) {
    // {gameId: 1, maintain: 0, platformId: 1}
    const platforms = this.platforms.platforms;
    const p = platforms.find((pl) => {
      return pl.id == data.platformId;
    });

    if (p) {

      // console.log('setGameMaintain p', p);

      const game = p.games.find((g) => {
        return g.id == data.id;
      });

      // console.log('setGameMaintain game', game);

      if (game) {
        game.maintain = data.maintain;
      }

    }


  }

  getQuestGroupList() {
    return this.http.get(ApiPath.ApiPublicQuestGroupList);
  }

}
