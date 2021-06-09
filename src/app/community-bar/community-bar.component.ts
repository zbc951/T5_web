import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PublicService } from './../app-service/public.service';
import { AppRoutes } from '../constant/routes';
import config from '../../config';
@Component({
  selector: 'app-community-bar',
  templateUrl: './community-bar.component.html',
  // styleUrls: ['./community-bar.component.scss']
})
export class CommunityBarComponent implements OnInit {
  AppRoutes = AppRoutes;
  communitys = [];
  constructor(
    // private publicService: PublicService,
    // private router: Router
  ) { }

  ngOnInit(): void {
    // fake
    this.communitys = [
      {
        name: 'live_chat',
        icon: 'assets/img/notice.svg',
        show: config.csServices.live_chat ? true : false
      },
      {
        name: 'line',
        icon: 'assets/img/line.svg',
        show: config.csServices.line ? true : false
      },
      {
        name: 'wechat',
        icon: 'assets/img/wechat.svg',
        show: config.csServices.wechat ? true : false
      },
    ];
  }

  click(name) {
    const csConfig = config.csServices;
    const data     = csConfig[name];
    if (!data) {
      return;
    }
    let url = '';
    if (typeof data === 'string') {
      url = data;
    } else if (data.url) {
      url = data.url;
    }
    if (url) {
      window.open(url, '_blank');
    }
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
}
