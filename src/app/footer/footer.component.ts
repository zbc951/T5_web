import { StatusType as vipstatus } from './../vip/vip.component';
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { PublicService, MarqueeType } from './../app-service/public.service';
import { AppRoutes } from '../constant/routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  // styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit {
  AppRoutes = AppRoutes;
  // MarqueeType = MarqueeType;
  // vipstatus = vipstatus;

  hostName = '';

  constructor(public publicService: PublicService, private router: Router) { }

  ngOnInit(): void {
    // console.log('AppRoutes', AppRoutes);
    const replaces = window['mdReplaces'] || { };
    this.hostName  = replaces['{SITE_HOST}'] || location.hostname;
  }

  ngAfterViewInit(): void { }


  goQuest(): void {
    this.publicService.goQuest();
  }

  goVip(): void {
    this.publicService.goVip();
  }

  openBulletin(): void {
    this.publicService.openBulletin();
  }

}
