import { UtilService } from './util.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiPath } from '../constant/api';
import { IResponseGame } from '../app-service/public.service'
import { BehaviorSubject, Observable, of } from 'rxjs';

export const retryLimit = 3;
export const retrySec = 3;

export enum transferType {
  OUT,
  IN
}

export enum moneyLoadStatus {
  LOADING = 'loading',
  GOT = 'got'
}

export enum buyResponse {
  // 購買完成
  ok = 'ok',
  // 是超過可購買數量
  exceedNum = '400',
  // 餘額不足
  moneyNotEnough = '403',
  // 是沒有這個產品
  noProd = '404',
}


export enum walletType {
  PLATFORM = 'platform',
  COUPON = 'coupon',
  COUPON_HISTORY = 'coupon-hisotry'
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  multiWalletPlatforms = [];
  platformsSubject = new BehaviorSubject([]);
  platformsSubject2 = new BehaviorSubject([]);
  activityWalletLogSubject = new BehaviorSubject([]);


  constructor(
    private http: HttpClient
  ) { }

  getMultiWalletPlatforms() {


    // console.log('getMultiWalletPlatforms');

    return this.http.get<IResponseGame>(ApiPath.ApiWalletGetGames)
      .subscribe(
        (res: any) => {

          // console.log('WalletService.getMultiWalletPlatforms res', res);
          const { data } = res;
          if (data.platforms) {

            data.platforms.forEach((platform: any) => {

              platform.balance = 0;
            });

            this.multiWalletPlatforms = data.platforms;

            // console.log('getMultiWalletPlatforms multiWalletPlatforms', this.multiWalletPlatforms);

            this.platformsSubject.next(this.multiWalletPlatforms);

            this.multiWalletPlatforms.forEach((p) => {

              this.getMultiBalance(p.key)
                .subscribe((balanceRes: any) => {
                  if (balanceRes.result == 'ok') {

                    p.balance = balanceRes.balance;
                    this.platformsSubject2.next(this.multiWalletPlatforms);

                  }
                });

            });
          }
        }
      );
  }

  getMultiPlatforms() {
    return this.platformsSubject.asObservable();
  }

  getMultiPlatforms2() {
    return this.platformsSubject2.asObservable();
  }

  updatePlatformsBalance(pkey = null) {

    if (pkey) {

      const pl = this.multiWalletPlatforms.find((p) => {

        return p.key == pkey;

      });

      console.log('updatePlatformsBalance pkey', pkey);

      if (pl) {

        this.getMultiBalance(pkey)
          .subscribe((balanceRes: any) => {

            if (balanceRes.result == 'ok') {

              pl.balance = balanceRes.balance;

              this.platformsSubject2.next(this.multiWalletPlatforms);

            }
          });
      }

    }
    // else {

    //   this.multiWalletPlatforms.forEach((p) => {

    //     this.getMultiBalance(p.key)
    //       .subscribe((balanceRes: any) => {
    //         if (balanceRes.result == 'ok') {

    //           p.balance = balanceRes.balance;
    //           this.platformsSubject2.next(this.multiWalletPlatforms);
    //         }
    //       });

    //   });
    // }
  }


  getMultiBalance(key) {
    return this.http.post<any>(`${ApiPath.ApiWalletGetwallet}/${key}/3`, {});
  }

  getMultiTranceOut(key, val, platformId) {
    return this.http.post<IResponseGame>(`${ApiPath.ApiWalletGetwallet}/${key}/5`, {
      amount: val,
      platformId: platformId
    });
  }

  getMultiTranceIn(key, val, platformId) {
    return this.http.post<IResponseGame>(`${ApiPath.ApiWalletGetwallet}/${key}/6`, {
      amount: val,
      platformId: platformId
    });
  }


  getActivityWallet(): Observable<any> {

    return this.http.post<any>(ApiPath.ApiAactivityAactivityWalletGet, {});

  }

  buyActivityWallet(productId, price = null): Observable<any> {
    return this.http.post<any>(ApiPath.ApiAactivityAactivityWalletBuy, {
      productId: productId,
      price: price
    });

  }


  getActivityWalletLog(formData: {
    startTime?: string,
    endTime?: string,
    platformId: [any],
    page?: number
  } = null) {

    // console.log('getActivityWalletLog formData', formData);

    if (formData) {

      if (formData.platformId[0] === 'all' || formData.platformId[0] === null) {
        formData.platformId = null;
      }

      const params = UtilService.getHttpParams(formData);
      return this.http.get<any>(ApiPath.ApiAactivityAactivityWalletLog, { params });

    } else {

      return this.http.get<any>(ApiPath.ApiAactivityAactivityWalletLog);

    }

  }

  getActivityWalletLogBySubject() {
    // console.log('getActivityWalletLogBySubject');

    return this.http.get<any>(ApiPath.ApiAactivityAactivityWalletLog)
      .subscribe((res: any) => {

        this.activityWalletLogSubject.next(res);

      });

  }

  getActivityWalletLogSub() {
    return this.activityWalletLogSubject.asObservable();
  }


  mountActivityWallet(
    params: {
      platformId,
      purchaseLogId
    }): Observable<any> {

    return this.http.post<any>(ApiPath.ApiActivityWalletMount, params);

  }

  unmountActivityWallet(
    params: {
      platformId
    }): Observable<any> {

    return this.http.post<any>(ApiPath.ApiActivityWalletUnmount, params);
  }


  getFromWalletActivityWallet(
    params: {
      purchaseLogId
    }): Observable<any> {

    return this.http.post<any>(ApiPath.ApiActivityWalletGetFromWallet, params);

  }

  getAactivityWalletWallets(
    params: {
      platformId
    }): Observable<any> {

    return this.http.post<any>(ApiPath.ApiActivityAactivityWalletWallets, params);

  }

  giveup(params: {
    purchaseLogId
  }): Observable<any> {

    return this.http.post<any>(ApiPath.ActivityWalletGiveUp, params);

  }

  getUserWalletAll(): Observable<any> {

    return this.http.post<any>(ApiPath.ApiActivityAactivityWalletWalletAll, {});

  }

  getActivityWalletReportList(params: {
    logId: number,
    page: number
  }): Observable<any> {

    // console.log('getActivityWalletReportList', params);

    return this.http.post<any>(ApiPath.ActivityWalletReportList, params);

  }


  getActivityWalletHistory() {
    return this.http.get<any>(ApiPath.ApiAactivityAactivityWalletHistory);
  }


  getPlatformWallet() {

    return this.http.get<any>(ApiPath.ApiWalletGetPlotformWallet);

  }


}
