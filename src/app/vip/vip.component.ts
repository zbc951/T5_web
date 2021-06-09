import { PublicService } from './../app-service/public.service';
import { AuthService } from './../app-service/auth.service';
import { MemberService } from './../app-service/member.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AppRoutes } from '../constant/routes';
import { Router } from '@angular/router';

export enum StatusType {
  CURRENT = 'current',
  DETAIL = 'detail',
}

interface rank {
  autoWater: number;
  autoWaterAt;
  bankLimit: number;
  // clubId;
  createdAt;
  depositDayTimes: number;
  depositPerMax: string;
  depositPerMin: string;
  // enabled;
  // franchiseeId;
  fullpay;
  id: number;
  name: string;
  // order;
  // updatedAt;
  upgradeByDeposit: string;
  upgradeByTotalBetAmount: string;
  upgradeByWithdraw: string;
  withdrawDayTimes: number;
  withdrawFee;
  withdrawFeePeriod: string;
  withdrawFeeType: string;
  withdrawFreeTimes: number;
  withdrawPerMax: string;
  withdrawPerMin: string;
}
@Component({
  selector: 'app-vip',
  templateUrl: './vip.component.html',
  // styleUrls: ['./vip.component.scss']
})
export class VipComponent implements OnInit, OnDestroy {
  StatusType = StatusType;
  type: any = StatusType.CURRENT;
  math = Math;

  partners;
  // partnersList;
  partnersWidth;
  partnersImgnum;
  partnersX = 0;

  @ViewChild('partnersList') partnersList: ElementRef;

  rankList = [];
  mine: rank;
  mine2: {
    total_bet?;
    total_deposit?;
    total_withdraw?;
  };

  mineIdx = 0;
  next: rank;
  nextLvName = '';
  barPercent;

  mdFileUrl = 'vip/lv';

  $rank;

  constructor(
    private memberService: MemberService,
    private auth: AuthService,
    private router: Router,
    private publicService: PublicService
  ) {
    this.publicService.pageTabLink.subscribe((tmpSublink) => {
      this.type = tmpSublink;
    });
  }

  ngOnInit(): void {
    const user = this.auth.user;
    // console.log('user', user);
    this.type = StatusType.CURRENT;
    // this.type = StatusType.DETAIL;

    this.$rank = this.memberService
      .listenClubRank()
      .subscribe((res) => {
        console.log('getClubRankList', res);

        this.rankList = res;

        const idx = this.rankList.findIndex((item) => {
          return user.clubRankId === item.id;
        });

        this.mineIdx = idx;
        this.mine = this.rankList[idx];

        // console.log('mine', this.mine);

        this.next =
          idx !== this.rankList.length - 1 ? this.rankList[idx + 1] : this.next;


        this.barPercent = (this.mineIdx + 1) / (this.rankList.length) * 100;

        this.partnersImgnum = this.rankList.length;
        this.partnersWidth = this.partnersImgnum * 290;

        if (this.publicService.tmpSublink) {
          // this.selectNavtype(this.publicService.tmpSublink);
          this.type = StatusType.DETAIL;
          this.publicService.tmpSublink = null;
        }

      });


    this.memberService.getMemberClubRank()
      .subscribe((res) => {
        // console.log('getMemberClubRank', res);
        this.mine2 = res;
      });

  }

  partnerR(): void {
    if (this.partnersX >= -this.partnersWidth + 3 * 290) {
      this.partnersX = this.partnersX - 290;
      this.partnersList.nativeElement.style.transform = `translate3d( ${this.partnersX}px, 0px, 0px)`;
    }
  }

  partnerL(): void {
    // console.log(this.partnersX, this.partnersWidth);
    if (this.partnersX !== 0) {
      this.partnersX = this.partnersX + 290;
      this.partnersList.nativeElement.style.transform = `translate3d( ${this.partnersX}px, 0px, 0px)`;
    }
  }


  ngOnDestroy() {
    if (this.$rank) {
      this.$rank.unsubscribe();
    }
  }

}
