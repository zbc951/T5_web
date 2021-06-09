import { UserInfoSetPhoneComponent } from './user-info-set-phone/user-info-set-phone.component';
import { WithdrawBetRecordComponent } from './withdraw-bet-record/withdraw-bet-record.component';
import { DrawbackComponent } from './drawback/drawback.component';
import { QuestPipe } from './quest.pipe';
import { CombineQuestApplyComponent } from './combine-quest-apply/combine-quest-apply.component';
import { PopupForgetPasswordComponent } from './popup-forget-password/popup-forget-password.component';
import { LangService } from './app-service/lang.service';
import { ResponseHandleHttpInterceptor } from './app-service/response-handle-http-interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  NoopAnimationsModule,
  BrowserAnimationsModule,
} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePickerModule, DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { loadCldr, L10n } from '@syncfusion/ej2-base';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CommonAlertComponent } from './common-alert/common-alert.component';
import { HomeComponent } from './home/home.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { HelpComponent } from './help/help.component';
import { AdComponent } from './ad/ad.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PopupBulletinComponent } from './popup-bulletin/popup-bulletin.component';
import { BulletinPipe } from './bulletin.pipe';
import { GameComponent } from './game/game.component';
import { MemberComponent } from './member/member.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { PopupRegisterComponent } from './popup-register/popup-register.component';
import { MerchantsComponent } from './merchants/merchants.component';
import { CommunityBarComponent } from './community-bar/community-bar.component';
import { VipComponent } from './vip/vip.component';
import { UserInfoDataComponent } from './user-info-data/user-info-data.component';
import { UserInfoPlatformComponent } from './user-info-platform/user-info-platform.component';
import { PopupTransferComponent } from './popup-transfer/popup-transfer.component';
import { SlotCenterComponent } from './slot-center/slot-center.component';
import { UserInfoSetPwdComponent } from './user-info-set-pwd/user-info-set-pwd.component';
import { TransferComponent } from './transfer/transfer.component';
import { SmallRecordComponent } from './small-record/small-record.component';
import { SmallBetRecordComponent } from './small-bet-record/small-bet-record.component';
import { SmallQueestComponent } from './small-queest/small-queest.component';
import { DepositComponent } from './deposit/deposit.component';
import { BankCardComponent } from './bank-card/bank-card.component';
import { BankCardRecordComponent } from './bank-card-record/bank-card-record.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { CouponWalletComponent } from './coupon-wallet/coupon-wallet.component';
import { PlatformWalletComponent } from './platform-wallet/platform-wallet.component';
import { LetterComponent } from './letter/letter.component';
import { MyWalletComponent } from './my-wallet/my-wallet.component';
import { ExperienceBarComponent } from './experience-bar/experience-bar.component';
import { ReviewComponent } from './review/review.component';
import { ReviewMainComponent } from './review-main/review-main.component';
import { ReviewBonusComponent } from './review-bonus/review-bonus.component';
// import { ReviewWalletComponent } from './review-wallet/review-wallet.component';
import { HeaderQuickTransferComponent } from './header-quick-transfer/header-quick-transfer.component';
import { LetterDetailComponent } from './letter-detail/letter-detail.component';
import { GametagsPipe } from './gametags.pipe';
import { SearchGamePipe } from './search-game.pipe';
import { BetLogComponent } from './bet-log/bet-log.component';
import { DateSelectorComponent } from './date-selector/date-selector.component';
import { QuestCenterComponent } from './quest-center/quest-center.component';
import { QuestDetailComponent } from './quest-detail/quest-detail.component';
import { ReviewTransferComponent } from './review-transfer/review-transfer.component';
import { FloatDisplayPipe } from './float-display.pipe';
import { OldQuestCenterComponent } from './old-quest-center/old-quest-center.component';
import { QuestRecordComponent } from './quest-record/quest-record.component';
import { AmountRecordComponent } from './amount-record/amount-record.component';
import { ThrottleBtnDirective } from './throttle-btn.directive';
import { SearchPanelComponent } from './search-panel/search-panel.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { LoadingComponent } from './loading/loading.component';
import { GameListComponent } from './game-list/game-list.component';
import { NumberOnlyDirective } from './number-only.directive';
import { MaintainTipComponent } from './maintain-tip/maintain-tip.component';
import { QrCodeModule } from 'ng-qrcode';
import { MarkdownComponent } from './markdown/markdown.component';

import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterObjVal } from './filter-objval.pipe';

// tslint:disable-next-line: typedef
export function createTranslateLoader(http: HttpClient) {
  // go with angular.json architect.build.options.assets
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
  // return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

export enum Lang {
  cn = 'zh-Hans',
  tw = 'zh-Hant',
  en = 'en',
  jp = 'jp',
}

declare var require: any;
loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/supplemental/weekData.json'),

  require('cldr-data/main/zh/timeZoneNames.json'),
  require('cldr-data/main/zh/numbers.json'),
  require('cldr-data/main/zh/ca-gregorian.json'),

  require('cldr-data/main/ja/timeZoneNames.json'),
  require('cldr-data/main/ja/numbers.json'),
  require('cldr-data/main/ja/ca-gregorian.json')
);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CommonAlertComponent,
    HomeComponent,
    HelpComponent,
    AnnouncementComponent,
    AdComponent,
    NavBarComponent,
    PopupBulletinComponent,
    BulletinPipe,
    GameComponent,
    PopupRegisterComponent,
    MerchantsComponent,
    MemberComponent,
    UserInfoComponent,
    PopupRegisterComponent,
    CommunityBarComponent,
    VipComponent,
    UserInfoDataComponent,
    UserInfoPlatformComponent,
    PopupTransferComponent,
    SlotCenterComponent,
    UserInfoSetPwdComponent,
    PopupTransferComponent,
    TransferComponent,
    SmallRecordComponent,
    SmallBetRecordComponent,
    SmallQueestComponent,
    DepositComponent,
    BankCardComponent,
    BankCardRecordComponent,
    WithdrawComponent,
    CouponWalletComponent,
    PlatformWalletComponent,
    LetterComponent,
    MyWalletComponent,
    ExperienceBarComponent,
    ReviewComponent,
    ReviewMainComponent,
    ReviewComponent,
    ReviewBonusComponent,
    // ReviewWalletComponent,
    HeaderQuickTransferComponent,
    LetterDetailComponent,
    GametagsPipe,
    SearchGamePipe,
    BetLogComponent,
    DateSelectorComponent,
    QuestCenterComponent,
    QuestDetailComponent,
    PopupForgetPasswordComponent,
    ReviewTransferComponent,
    FloatDisplayPipe,
    OldQuestCenterComponent,
    CombineQuestApplyComponent,
    QuestRecordComponent,
    QuestPipe,
    AmountRecordComponent,
    DrawbackComponent,
    WithdrawBetRecordComponent,
    ThrottleBtnDirective,
    SearchPanelComponent,
    SafeHtmlPipe,
    LoadingComponent,
    GameListComponent,
    NumberOnlyDirective,
    UserInfoSetPhoneComponent,
    MaintainTipComponent,
    MarkdownComponent,
    FilterObjVal
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    DatePickerModule,
    DateRangePickerModule,
    NgxPaginationModule,
    ClipboardModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    QrCodeModule,
    NgbCarouselModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseHandleHttpInterceptor,
      multi: true
    },
    DecimalPipe,
    GametagsPipe,
    SearchGamePipe],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private translate: TranslateService,
    private langService: LangService
  ) {

    L10n.load({
      zh: {
        datepicker: {
          today: '今天'
        },
        daterangepicker: {
          cancelText: '取消',
          applyText: '確定'
        }
      },
      ja: {
        datepicker: {
          today: 'きょう'
        },
        daterangepicker: {
          cancelText: 'キャンセル',
          applyText: '適用する'
        }
      },
    });

    this.translate.setDefaultLang(Lang.tw);
    this.translate.use(Lang.tw)
      .subscribe((res) => {

        // console.log('translate.use');
        // this.langService.setTxt(res);

      });
  }
}

