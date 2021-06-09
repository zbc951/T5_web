import { AppRoutes } from './../constant/routes';
import { PublicService } from './../app-service/public.service';
import { LogService } from './../app-service/log.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-small-bet-record',
  templateUrl: './small-bet-record.component.html',
  // styleUrls: ['./small-bet-record.component.scss']
})
export class SmallBetRecordComponent implements OnInit {


  record;
  betLoglist = [];
  gamePlatforms = [];
  AppRoutes = AppRoutes;
  Number = Number;

  constructor(
    // private router: Router,
    private logService: LogService,
    private publicService: PublicService

  ) {

  }

  ngOnInit(): void {



    this.queryBet();

  }

  queryBet(): void {
    // console.log('queryBet');
    // const periodTime = this.dateSelector.getPeriodTime();

    // this.betLogForm.controls.startTime.patchValue(periodTime.start);
    // this.betLogForm.controls.endTime.patchValue(periodTime.end);

    // console.log('this.betLogForm.value', this.betLogForm.value);

    this.gamePlatforms = this.publicService.platforms.platforms;
    const len = this.gamePlatforms.length;
    const idarr = this.gamePlatforms.map((item) => {
      return item.id;
    });


    const data: any = {};
    data.platformId = idarr;

    this.logService.perDaySumBetLog(data)
      .subscribe((res: any) => {

        this.betLoglist = res.data.content;

      });
  }


}
