import { MaintainService } from './../app-service/maintain.service';
import { UtilService } from './../app-service/util.service';
import { EventService } from './../app-service/event.service';
import { MemberService, amountType } from './../app-service/member.service';
import { PublicService } from './../app-service/public.service';
import { LangService } from './../app-service/lang.service';
import { ToastService } from './../app-service/toast.service';
import { WalletService } from './../app-service/wallet.service';
import { AuthService } from './../app-service/auth.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';

const centerWalletValue = '';
@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  // styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {

  isLoading = false;
  platformWalletOpen = false;

  sideBoardType = 'transfer';

  amountTypes = [100, 500, 1000, 3000, 5000, 10000];

  // 不能存轉提
  locked = false;

  user;
  allPlatforms;
  platforms;
  transferform: FormGroup;
  centerWalletTxt = '';

  select1_options = [];
  select2_options = [];

  centerWalletValue = centerWalletValue;


  $data;

  walletSumup = 0;
  $data1;
  unmounting = false;
  apiResponseCount = 0;
  platformWallet = [];

  isActivityWallet = false;


  platformsWithWallet = [];
  transferWalletform: FormGroup;
  transferBackform: FormGroup;
  couponWallets;
  curSelect: any = 'default';
  isGetAllBalanceIng = false;

  constructor(
    private auth: AuthService,
    private walletService: WalletService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private langService: LangService,
    private publicService: PublicService,
    private memberService: MemberService,
    private maintainService: MaintainService
  ) {

    this.translateService.get('PFTRANSITION.CENTER')
      .subscribe((res: any) => {

        this.centerWalletTxt = res;

      });

    this.transferform = this.formBuilder
      .group({
        select1: -1,
        select2: -1,
        amount: 0
      });

    this.transferform.controls.select1
      .valueChanges
      .subscribe((res) => {

        // console.log('select1.valueChanges', res);
        if (res == centerWalletValue) {

          this.select2_options = this.allPlatforms;

        } else {
          this.select2_options = [
            {
              name: this.centerWalletTxt,
              value: ''
            }
          ];
        }
      });


    // this.transferWalletform = this.formBuilder
    //   .group({
    //     platform: -1,
    //     couponWallet: -1,
    //   });

    // this.transferWalletform.controls.couponWallet
    //   .valueChanges
    //   .subscribe((id) => {

    //     // console.log('couponWallet valueChanges', id);
    //     this.getPlatformOfWallet(id);

    //   });

    // this.transferBackform = this.formBuilder
    //   .group({
    //     item: -1,
    //     wallet: '',
    //   });

    // this.transferBackform.controls.item
    //   .valueChanges
    //   .subscribe((itemId) => {

    //     // console.log('Platform.valueChanges', itemId);

    //     const item = this.platformsWithWallet.find((item) => {

    //       return item.id == itemId;

    //     });

    //     if (item) {

    //       const name = item.log ? item.log.name : this.centerWalletTxt;
    //       this.transferBackform.controls.wallet.patchValue(name);

    //     }


    //   });

    // this.refreshAll();
  }

  ngOnInit(): void {


    this.isActivityWallet = this.publicService.isActivityWallet;
    this.transferform.controls.select1
      .valueChanges
      .subscribe((res) => {

        console.log('select1', res);
        this.transferform.controls.amount.patchValue(0);
        // curSelect 會是 platform key
        this.curSelect = res;

      });

    // console.log('isActivityWallet', this.isActivityWallet);

    // if (this.isActivityWallet) {


    //   this.$data = this.memberService.getAmountSub()
    //     .subscribe((res: any) => {

    //       // console.log('memberService.getAmountSub res', res);

    //       if (res.data) {
    //         this.walletSumup = res.data.activity_wallet_total;
    //       }

    //     });

    //   this.$data1 = this.walletService.getMultiPlatforms()
    //     .subscribe((res) => {

    //       // console.log(' walletService.getMultiPlatforms res', res);

    //       this.platformWallet = res;

    //     });

    //   this.getUserWalletAll();
    //   this.getPlatformWallet();

    // } else {

    //   this.getMultiPlatforms();

    // }

    this.getMultiPlatforms();

    this.auth.getWalletSub()
      .subscribe(
        this.refreshMoney.bind(this)
      );

    this.user = this.auth.user;
    this.locked = this.publicService.locked;

    if (this.locked) {
      this.transferform.disable();
    }

  }

  getMultiPlatforms() {
    this.walletService.getMultiPlatforms()
      .pipe(first())
      .subscribe((res) => {

        // console.log('**getMultiPlatforms', res);

        res.forEach(p => {

          p.maintain = this.maintainService.checkByPlatformId(p.id);

        });

        this.allPlatforms = [...res];
        this.select1_options = [...res];

        // console.log('allPlatforms', this.allPlatforms);

      });
  }

  // getUserWalletAll(): void {

  //   this.walletService.getUserWalletAll()
  //     .subscribe((res) => {

  //       // console.log('getUserWalletAll', res);
  //       this.couponWallets = res.data.wallets;
  //       // console.log('couponWallets', this.couponWallets);
  //     });
  // }


  refreshMoney(res): void {
    // console.log('refreshMoney res', res, this.auth.user.money);
    // this.money = this.auth.user.money;
    this.user = this.auth.user;

    if (this.isActivityWallet) {

      this.memberService.getAmount([amountType.activity]).subscribe();
    }


    // 這一段 感覺沒有必要
    // 至少 for 非活動錢包 沒有必要
    // this.publicService.getPlatforms().subscribe((res: any) => {

    //   console.log('res', res);

    //   const platforms = res.platforms;

    //   platforms.forEach(p => {

    //     p.maintain = this.maintainService.checkByPlatformId(p.id);

    //   });

    // });

    // console.log('allPlatforms', this.allPlatforms);

    this.allPlatforms.forEach((p) => {
      p.maintain = this.maintainService.checkByPlatformId(p.id);
    });

    // console.log('**', this.platforms);


    if (this.isActivityWallet) {

      this.walletService.getActivityWalletLogBySubject();
    }

    EventService.dispatch(EventService.TRANSFER_UPDATE_PLATFORMWALLET);

  }

  refreshOne(pkey): void {

    this.auth.getWallet();
    // 只需更新 戶內轉帳 所操作的平台
    this.walletService.updatePlatformsBalance(pkey);

  }

  refreshAll(): void {

    console.log('refreshAll');

    this.auth.getWallet();
    this.walletService.getMultiWalletPlatforms();
  }

  transferMsg(res): void {

    let unmountPlatform = this.allPlatforms.find((p) => {

      return p.id == res.unmount.platformId;

    });

    if (res.unmount.walletId == null) {
      unmountPlatform = {
        name: this.centerWalletTxt
      };
    }

    let mountPlatform = this.allPlatforms.find((p) => {

      return p.id == res.mount.platformId;

    });

    if (res.mount.walletId == null) {

      res.mount.walletName = this.centerWalletTxt;
    }

    const key = res.unmount.walletId == 0 ? 'TRANSFER.MANUAL.MSG1' : 'TRANSFER.MANUAL.MSG0';

    // console.log('key', key, unmountPlatform, mountPlatform);

    if (res.unmount.walletId == 0) {
      this.translateService.get(key, {

        mount: {
          platformName: mountPlatform.name,
          amount: res.mount.amount,
          walletName: res.mount.walletName
        }

      })
        .subscribe((res) => {

          // console.log('transferMsg res', res);

          this.toast.error(res);
          this.refreshAll();
          this.walletService.getMultiWalletPlatforms();
          // location.reload();
        });

    } else {
      this.translateService.get(key, {

        unmount: {
          platformName: unmountPlatform.name,
          amount: res.unmount.amount,
          walletName: res.unmount.walletName
        },
        mount: {
          platformName: mountPlatform.name,
          amount: res.mount.amount,
          walletName: res.mount.walletName
        }

      })
        .subscribe((res) => {

          // console.log('transferMsg res', res);

          this.toast.error(res);
          this.refreshAll();
          // this.sideBoardType = 'transfer';
          // location.reload();
          this.walletService.getMultiWalletPlatforms();
        });
    }


    // this.translateService.get(key, {

    //   unmount: {
    //     platformName: unmountPlatform.name,
    //     amount: res.unmount.amount,
    //     walletName: res.unmount.walletName
    //   },
    //   mount: {
    //     platformName: mountPlatform.name,
    //     amount: res.mount.amount,
    //     walletName: res.mount.walletName
    //   }

    // })
    //   .subscribe((res) => {

    //     // console.log('transferMsg res', res);

    //     this.toast.error(res);
    //     this.refreshAll();
    //     this.walletService.getMultiWalletPlatforms();
    //   });
  }

  // getPlatformWallet() {

  //   this.walletService.getPlatformWallet()
  //     .subscribe((res) => {

  //       // console.log('getPlatformWallet', res);
  //       // console.log('platforms', this.platforms);

  //       this.platformsWithWallet = res;

  //       this.platformsWithWallet.forEach((p) => {

  //         const plat = this.platforms.find((p1) => {

  //           return p1.id == p.platformId;

  //         });

  //         if (plat) {
  //           // console.log(plat);

  //           if (plat.maintain) {
  //             p.maintain = true;

  //           }
  //         }

  //       });

  //     });

  // }

  amountOnChange(val): void {

    if (this.locked) {
      return;
    }

    this.transferform.controls.amount.patchValue(val);
  }

  transferAllAmount(): void {

    console.log('transferAllAmount curSelect', this.curSelect);

    if (this.curSelect) {

      this.isGetAllBalanceIng = true;

      this.walletService.getMultiBalance(this.curSelect)
        .subscribe(
          (balanceRes: any) => {

            if (balanceRes.result == 'ok') {

              console.log('select1_options', this.select1_options);
              const pl = this.select1_options.find((p) => {
                return p.key == this.curSelect;
              });

              if (pl) {
                pl.balance = balanceRes.balance;
                this.transferform.controls.amount.patchValue(Number(pl.balance));
              }

            }
          }, (err) => {
          }).add(() => {
            this.isGetAllBalanceIng = false;
          });

    } else {

      // 中心錢包 curSelect 為 ""
      console.log('user', this.user);
      this.transferform.controls.amount.patchValue(this.user.money);
    }
  }


  transfer(): void {

    this.isLoading = true;

    const select1_value = this.transferform.controls.select1.value;

    if (select1_value == centerWalletValue) {

      this.transferIntoPlatform();
    } else {

      this.transferOutFromPlatform();
    }
  }


  transferIntoPlatform() {

    // console.log('transferIntoPlatform');
    const key = this.transferform.controls.select2.value;
    const val = this.transferform.controls.amount.value;

    const pl = this.select2_options.find((p) => {
      return key == p.key;
    });

    if (!pl) {
      console.log(key, val);
      return;

    }

    this.walletService
      .getMultiTranceIn(key, val, pl.id)
      .subscribe(
        (res) => {

          // console.log('multiTranceIn', res);
          this.isLoading = false;
          // this.refreshAll();
          this.refreshOne(key);
        },
        (err) => {

          // console.log('err', err);

          this.isLoading = false;

          if (err.error.message && typeof err.error.message == 'string') {

            // console.log('********');
            const msg = (err.error.message == 'game maintain') ? this.langService.translations.MAINTAINING : err.error.message;

            this.toast.error(msg);
            return;

          }

          if (err.error && typeof err.error == 'string') {

            this.toast.error(err.error);
            return;

          }

          this.toast.error(err.message);

        }).add(() => {
          this.transferform.controls.amount.patchValue(0);
        });

  }

  transferOutFromPlatform() {

    console.log('transferOutFromPlatform');
    const key = this.transferform.controls.select1.value;
    const val = this.transferform.controls.amount.value;
    const pl = this.select1_options.find((p) => {
      return key == p.key;
    });

    if (!pl) {

      console.log('key', key, "pl", pl);

      return;
    }




    this.walletService
      .getMultiTranceOut(key, val, pl.id)
      .subscribe(
        (res) => {

          console.log('multiTranceOut', res);
          this.isLoading = false;
          // this.refreshAll();
          this.refreshOne(key);
        },
        (err) => {
          this.isLoading = false;

          if (err.error.message && typeof err.error.message == 'string') {

            this.toast.error(err.error.message);
            return;

          }

          if (err.error && typeof err.error == 'string') {

            this.toast.error(err.error);
            return;
          }

          this.toast.error(err.message);

        }).add(() => {

          console.log('***');
          // this.transferform.controls.amount.patchValue(0);

        });

  }

  clickBackAll() {
    // 現在 我需要先更新平台的錢

    this.getTransAllBalance(() => {
      this.tranferBackAll();
    });

  }

  getTransAllBalance(callback) {

    // console.log('getTransAllBalance');

    this.apiResponseCount = this.allPlatforms.length;
    this.isLoading = true;

    this.allPlatforms.forEach((platform: any) => {

      // platform.getStatus = moneyLoadStatus.LOADING;

      // console.log('getMultiBalance', platform.key);
      this.walletService.getMultiBalance(platform.key)
        .subscribe(
          (balanceRes: any) => {


            if (balanceRes.result == 'ok') {
              // platform.getStatus = moneyLoadStatus.GOT;
              platform.balance = balanceRes.balance;
            }
          }, (err) => {
            // platform.getStatus = moneyLoadStatus.GOT;
          }).add(() => {

            this.apiResponseCount--;

            if (this.apiResponseCount == 0) {

              this.isLoading = false;
              callback();

            }

          });
    });
  }


  tranferBackAll() {


    // 沒錢的平台 要不用 轉了
    const platformsWithBal = this.allPlatforms.filter((p) => {
      return Number(p.balance);
    });

    // 根本沒有有可以轉的平台
    if (platformsWithBal.length == 0) {
      return;
    }

    this.apiResponseCount = platformsWithBal.length;
    this.isLoading = true;

    // console.log('tranferBackAll', this.allPlatforms);

    this.allPlatforms.forEach((platform: any) => {

      const balance = Number(platform.balance);

      if (balance) {

        this.walletService.getMultiTranceOut(platform.key, platform.balance, platform.id)
          .subscribe(
            (balanceRes: any) => {

              this.tellShouldCloseLoading();

            }, (err) => {

              this.tellShouldCloseLoading();

            });
      }


    });


  }

  // mountActivityWallet(): void {

  //   this.isLoading = true;

  //   const formdata = this.transferWalletform.value;

  //   this.walletService.mountActivityWallet({
  //     platformId: formdata.platform,
  //     purchaseLogId: formdata.couponWallet
  //   })
  //     .subscribe(
  //       (res) => {

  //         this.transferMsg(res);
  //         this.getUserWalletAll();

  //       },
  //       (err) => {

  //         // console.log('err', err);

  //         if (err.error && typeof err.error === 'string') {
  //           this.toast.error(err.error);
  //         }

  //         if (err.error.message) {
  //           this.toast.error(err.error.message);
  //           return;
  //         }

  //         if (err.error.errors) {

  //           const msg = UtilService.contactErrMsg(err.error.errors);
  //           this.toast.error(msg);

  //         }

  //       }

  //     ).add(() => {

  //       this.transferWalletform.controls.couponWallet.patchValue(-1);
  //       this.transferWalletform.controls.platform.patchValue(-1);

  //       this.isLoading = false;
  //       this.getPlatformWallet();
  //     });

  // }

  // unmount() {

  //   // console.log('unmount', this.transferBackform.value);

  //   const item = this.platformsWithWallet.find((item) => {

  //     return item.id == this.transferBackform.value.item;

  //   });

  //   if (item) {

  //     console.log('item', item);
  //     // return;

  //     this.isLoading = true;

  //     this.walletService.unmountActivityWallet({
  //       platformId: item.platform.id
  //     }).subscribe(
  //       (res) => {

  //         // console.log('unmountActivityWallet res', res);
  //         if (res.result === 'ok') {

  //         } else {

  //           this.toast.error(this.langService.translations.SERVER_ERROR);

  //         }


  //       },
  //       (err) => {

  //         console.log('err', err);
  //         if (err.error && typeof err.error === 'string') {
  //           this.toast.error(err.error);

  //         }

  //         if (err.error.message) {
  //           this.toast.error(err.error.message);
  //           return;
  //         }


  //       }).add(() => {

  //         this.transferBackform.reset();
  //         this.transferBackform.controls.item.patchValue(-1);

  //         this.refreshAll();
  //         this.walletService.getMultiWalletPlatforms();
  //         this.getPlatformWallet();
  //         this.getUserWalletAll();

  //         this.isLoading = false;
  //       });
  //   }


  // }


  // unmountActivityWallet(): void {

  //   // batch calling

  //   this.apiResponseCount = this.platformWallet.length;
  //   // console.log('apiResponseCount', this.apiResponseCount);
  //   this.isLoading = true;

  //   this.platformWallet.forEach((platform) => {

  //     this.walletService.unmountActivityWallet({
  //       platformId: platform.id
  //     })
  //       .subscribe(
  //         (res) => {

  //           // console.log('unmountActivityWallet res', res);
  //           if (res.result === 'ok') {


  //             this.unmounting = true;

  //             // this.getMultiBalance(platform);



  //           } else {

  //             this.toast.error(this.langService.translations.SERVER_ERROR);

  //           }

  //           this.tellShouldCloseLoading();

  //         },
  //         (err) => {
  //           // console.log('err', err);
  //           if (err.error && typeof err.error === 'string') {
  //             this.toast.error(err.error);

  //           }
  //           this.tellShouldCloseLoading();
  //         }
  //       );

  //   });


  // }

  tellShouldCloseLoading() {
    if (this.apiResponseCount == 0) {
      return;
    }

    this.apiResponseCount--;
    // console.log('** tellShouldCloseLoading ', this.apiResponseCount);

    if (this.apiResponseCount == 0) {
      this.refreshAll();
      this.isLoading = false;
    }
  }


  // getPlatformOfWallet(pid): void {

  //   console.log('getPlatformOfWallet', pid);

  //   if (pid) {

  //     const wallet = this.couponWallets.find((item) => {
  //       return item.id == pid;
  //     });

  //     // console.log('wallet', wallet);
  //     console.log(this.allPlatforms);

  //     let tmpArr = [];

  //     this.allPlatforms.forEach((item) => {

  //       if (wallet.platforms.includes(item.id)) {
  //         tmpArr.push(item);
  //       }

  //     });


  //     // console.log('tmpArr', tmpArr);
  //     this.platforms = tmpArr;
  //     console.log('**platforms', this.platforms);



  //   } else {

  //     this.platforms = this.allPlatforms;
  //   }

  // }


  @HostListener(`window:${EventService.MAINTAIN_UPDATE}`, ['$event'])
  update(event): void {

    // return;

    const { data } = event.detail;

    if (this.isActivityWallet) {

      // if (data.platform && this.platforms) {


      //   const ref = data.platform;

      //   console.log('ref', ref);
      //   this.platforms.forEach((p) => {

      //     // console.log(p, ref);

      //     if (p.id == ref.id) {

      //       p.maintain = (ref.isRoutineMaintainIng || ref.maintain) ? true : false;

      //     }

      //   });

      //   this.allPlatforms.forEach((p) => {

      //     if (p.id == ref.id) {

      //       p.maintain = (ref.isRoutineMaintainIng || ref.maintain) ? true : false;
      //     }

      //   });

      //   // console.log('this.platforms', this.platforms);

      //   this.platformsWithWallet.forEach((p) => {

      //     // console.log('platformsWithWallet', p);

      //     if (p.platformId == ref.id) {

      //       p.maintain = (ref.isRoutineMaintainIng || ref.maintain) ? true : false;
      //     }

      //   });


      //   // this.platforms = res.platforms;
      //   // this.allPlatforms = res.platforms;

      // }
    } else {

      if (data.platform && this.allPlatforms) {


        const ref = data.platform;

        // console.log('ref', ref);

        this.allPlatforms.forEach((p) => {

          if (p.id == ref.id) {

            p.maintain = (ref.isRoutineMaintainIng || ref.maintain) ? true : false;
          }

        });

      }
    }


  }


}
