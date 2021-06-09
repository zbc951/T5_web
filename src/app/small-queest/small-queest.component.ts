import { forkJoin } from 'rxjs';
import { WalletService } from './../app-service/wallet.service';
import { MemberService } from './../app-service/member.service';
import { PublicService } from './../app-service/public.service';
import { Component, OnInit } from '@angular/core';
import { AppRoutes } from './../constant/routes';

@Component({
  selector: 'app-small-queest',
  templateUrl: './small-queest.component.html',
  styleUrls: ['./small-queest.component.scss']
})
export class SmallQueestComponent implements OnInit {

  questList = [];
  public AppRoutes = AppRoutes;


  constructor(
    private publicService: PublicService,
    private memberService: MemberService
  ) { }

  ngOnInit(): void {

    this.memberService.getQuestList()
      .subscribe((res) => {

        this.questList = res.data.content;
      });

  }

}
