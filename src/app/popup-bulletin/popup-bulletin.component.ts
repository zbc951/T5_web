import { AuthService } from './../app-service/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PublicService, MarqueeType } from '../app-service/public.service';

@Component({
  selector: 'app-popup-bulletin',
  templateUrl: './popup-bulletin.component.html',
  // styleUrls: ['./popup-bulletin.component.scss']
})
export class PopupBulletinComponent implements OnInit {

  MarqueeType = MarqueeType;
  newsList = [];
  navType = MarqueeType.Normal;
  private marquees: Observable<any[]>;
  isLogin = false;

  constructor(
    private router: Router,
    private publicService: PublicService,
    private auth: AuthService

  ) { }

  ngOnInit(): void {

    this.marquees = this.publicService.getMarguee();
    this.marquees.subscribe((list) => {

      this.newsList = list;

      if (this.publicService.tmpSublink) {

        this.selectNavtype(this.publicService.tmpSublink);
        this.publicService.tmpSublink = null;
      }

    });

    this.auth.isLogin()
      .subscribe((islogin) => {
        this.isLogin = islogin;
      });

  }

  selectNavtype(n): void {

    // console.log('selectNavtype', n);

    this.navType = n;
  }

  close(): void {
    this.router.navigate([{ outlets: { popup: null } }]);
  }
}
