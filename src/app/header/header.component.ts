import config from 'src/config';
import { GameService } from './../app-service/game.service';
import { HeaderQuickTransferComponent } from './../header-quick-transfer/header-quick-transfer.component';
import { LetterService } from './../app-service/letter.service';
import { ToastService } from './../app-service/toast.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './../app-service/auth.service';
import { PublicService, GameTypeKey } from './../app-service/public.service';
import { LangService } from './../app-service/lang.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { from, Observable } from 'rxjs';
import { AppRoutes } from '../constant/routes';
import { CUI } from '@cui/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  // styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  noLogo = config.noLogo.noLogo;


  h = '100vh';
  isHover = false;
  tmpHover;
  AppRoutes = AppRoutes;
  GameTypeKey = GameTypeKey;
  public isLogin = false;
  loginForm: FormGroup;
  user: {
    account?: string;
    money?: number;
    clubRank?: string;
    id?: number;
    lv?: string
  } = {};

  // menu: Observable<any[]>;
  menu = [];
  tabNow = 'home';
  unread = 0;
  currentLang;
  showItems = [];
  public route = '';

  routeTypeMap = {
    [AppRoutes.SPORT]: GameTypeKey.Sport,
    [AppRoutes.LIVE]: GameTypeKey.Live,
    [AppRoutes.SLOT]: GameTypeKey.Slot,
    [AppRoutes.LOTTO]: GameTypeKey.Lottery,
    [AppRoutes.FISH]: GameTypeKey.Fishing,
    [AppRoutes.BOARD]: GameTypeKey.Board,
  };

  partners;
  // partnersList;
  partnersWidth;
  partnersImgnum;
  partnersX = 0;
  @ViewChild('partnersList') partnersList: ElementRef;

  transferActive = false;
  @ViewChild('transferBtn') transferBtn: ElementRef;
  @ViewChild(HeaderQuickTransferComponent, { read: ElementRef })
  transferComponent: ElementRef;

  activeItem;

  isMaintain = false;
  isActivityWallet = false;
  canUpgrade = false;

  constructor(
    private translate: TranslateService,
    private langService: LangService,
    public publicService: PublicService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastService: ToastService,
    private letterService: LetterService,
    private gameService: GameService,
  ) {

    this.publicService.isMaintainSub
      .subscribe((res) => {

        this.isMaintain = res;
        // console.log('isMaintain', this.isMaintain);

      });

    this.publicService.getIsActivityWallet()
      .subscribe((res) => {

        this.isActivityWallet = res;
        console.log('isActivityWallet', this.isActivityWallet);

      });

    this.loginForm = this.formBuilder.group({
      account: '',
      password: '',
    });

    this.auth.isLogin().subscribe((isLogin) => {
      this.isLogin = isLogin;
      const { user } = this.auth;

      if (isLogin) {

        const lv = user.clubRank.split(')')[1].trim();
        user.lv = lv;

        /* 判斷是否還可以升級的層級, 會決定顯不顯 vip 頁面 */
        this.canUpgrade = this.auth.canUpgrade;
      }

      this.user = user;
      // console.log('user', this.user);

    });

    this.letterService.getUnreads().subscribe((res: any) => {
      // console.log('getUnreads', res);
      this.unread = res;
    });

    this.currentLang = this.translate.currentLang;

    this.translate.onLangChange.subscribe((evt: LangChangeEvent) => {
      const { translations } = evt;
      this.menu.forEach((item) => {
        item.tname = translations.HEADER_NAV[item.type];
      });
    });

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.route = event.url.split('/')[1];
        // 檢查 localstorage 的資料，不是當前登入者就 init
        if (this.user) {
          let localUserId = parseInt(localStorage.getItem('userId'));
          if (localUserId !== this.user.id) {
            this.publicService.init();
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.langService.onloadSub.subscribe((boo) => {
      if (boo) {
        this.publicService.getTypeMenu().subscribe((res) => {
          const { translations } = this.langService;
          // console.log('translations', translations);
          // console.log('getTypeMenu res', res);

          res.forEach((item) => {
            item.tname = translations.HEADER_NAV[item.type];

            switch (item.type) {
              case 'board':
                item.url = AppRoutes.BOARD;
                break;
              case 'fishing':
                item.url = AppRoutes.FISH;
                break;
              case 'live':
                item.url = AppRoutes.LIVE;
                break;
              case 'lottery':
                item.url = AppRoutes.LOTTO;
                break;
              case 'slot':
                item.url = AppRoutes.SlotCenter;
                break;
              case 'sport':
                item.url = AppRoutes.SPORT;
                break;
            }
          });

          const typeKeys = [
            GameTypeKey.Sport,
            GameTypeKey.Live,
            GameTypeKey.Lottery,
            GameTypeKey.Slot,
            GameTypeKey.Fishing,
            GameTypeKey.Board
          ];

          this.menu = typeKeys
            .map((key) => {
              let idx = res.findIndex((t) => t.type == key);
              return idx >= 0 ? res[idx] : null;
            })
            .filter((game) => game !== null);

        });
      }
    });
  }

  changeLang(evt): void {
    this.translate.use(evt.target.value);
  }

  login(): void {
    const accountCtrl = this.loginForm.get('account');

    if (accountCtrl.value) {
      accountCtrl.patchValue(accountCtrl.value.trim());
    }

    const pwdCtrl = this.loginForm.get('password');

    if (pwdCtrl.value) {
      pwdCtrl.patchValue(pwdCtrl.value.trim());
    }

    this.publicService.login(this.loginForm.value);
    this.loginForm.reset();
  }

  logout(): void {
    this.publicService.logout().subscribe((res) => {
      this.isLogin = false;
      this.user = {};
      this.router.navigateByUrl(AppRoutes.HOME);
    });
  }

  goPage(type): void {
    this.isHover = false;

    this.tabNow = type;
    let path;

    switch (type) {
      case GameTypeKey.Fishing:
        path = AppRoutes.FISH;
        break;
      case GameTypeKey.Board:
        path = AppRoutes.BOARD;
        break;
      case GameTypeKey.Slot:
        this.gameService.cutToPlatformSubject5.next({});
        path = AppRoutes.SlotCenter;
        break;
      case GameTypeKey.Live:
        path = AppRoutes.LIVE;
        break;
      case GameTypeKey.Sport:
        path = AppRoutes.SPORT;
        break;
      case GameTypeKey.Lottery:
        path = AppRoutes.LOTTO;
        break;

      default:
        return;
        break;
    }

    // console.log('path', path);

    this.router.navigateByUrl('/' + path);
  }

  goLetter(): void {
    if (this.isLogin) {
      this.router.navigateByUrl(AppRoutes.LETTER);
    } else {
      this.router.navigate([{ outlets: { popup: [AppRoutes.BULLETIN] } }]);
    }
  }

  openRegister(): void {

    if (this.isMaintain) {
      return;
    }

    this.router.navigateByUrl(AppRoutes.REGISTER);
  }

  hover(type): void {
    if (!type) {
      this.isHover = false;
      return;
    }

    // console.log('hover type', type, this.tmpHover);
    if (this.tmpHover && this.tmpHover === type) {
    } else {
      this.partnersX = 0;
      this.partnersList.nativeElement.style.transform = `translateX( ${this.partnersX}px)`;
    }

    this.tmpHover = type;

    if (!type) {
      this.isHover = false;
      return;
    }

    this.h = document.body.clientHeight - 53 - 80 - 36 + 'px';
    this.showItems = this.publicService.getShowItems(type);
    // console.log('showItems', this.showItems);

    if (!this.showItems || (this.showItems && this.showItems.length == 0)) {
      return;
    }

    // console.log(type, 'showItems', this.showItems);


    this.partnersImgnum = this.showItems.length;
    this.partnersWidth = this.partnersImgnum * 220;
    this.isHover = true;
  }

  @HostListener('document:click', ['$event.target'])
  private onClick(targetElement): void {
    // console.log('targetElement', targetElement);
    if (!this.isLogin) {
      // this.toastService.error(this.langService.translations.loginFirst, 3000);
      return;
    }

    if (this.transferActive) {
      const transferComponent = this.transferComponent.nativeElement;

      if (
        !(
          targetElement === transferComponent ||
          transferComponent.contains(targetElement)
        )
      ) {
        this.transferActive = false;
      }
    } else {
      // // console.log('transferBtn', this.transferBtn);
      const btn: any = this.transferBtn.nativeElement;
      if (targetElement === btn || btn.contains(targetElement)) {
        this.transferActive = true;
      }
    }
  }

  clickGame(item): void {
    // console.log('clickGame', item, this.tmpHover);
    const { tmpHover } = this;
    if (
      tmpHover === GameTypeKey.Slot ||
      tmpHover === GameTypeKey.Board ||
      tmpHover === GameTypeKey.Fishing
    ) {
      let url = AppRoutes.SlotCenter;
      if (tmpHover === GameTypeKey.Board) {
        url = AppRoutes.BOARD;
      } else if (tmpHover === GameTypeKey.Fishing) {
        url = AppRoutes.FISH;
      }
      this.router.navigateByUrl(url);

      // const currentUrl = this.router.url;

      this.gameService.cutToPlatformSubject5.next(item);

      return;
    }

    // platform; 這裡 game 的值有跟著被改
    if (item.maintain) {

      return;

    }


    this.gameService.clickGame(item, this.tmpHover);
  }

  partnerR(): void {
    if (this.partnersX >= -this.partnersWidth + 220 * 2) {
      this.partnersX = this.partnersX - 220;
      this.partnersList.nativeElement.style.transform = `translateX( ${this.partnersX}px)`;
    }
  }

  partnerL(): void {
    console.log(this.partnersX, this.partnersWidth);
    if (this.partnersX != 0) {
      this.partnersX = this.partnersX + 220;
      this.partnersList.nativeElement.style.transform = `translateX( ${this.partnersX}px)`;
    }
  }

  goForget(): void {
    this.router.navigate([{ outlets: { popup: [AppRoutes.FORGET] } }]);
  }
}
