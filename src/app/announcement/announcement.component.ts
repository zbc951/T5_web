import { AuthService } from './../app-service/auth.service';
import { AppRoutes } from './../constant/routes';
import { Router } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicService, MarqueeType } from '../app-service/public.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  // styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  marquees = [];
  showCnt;
  total = 0;
  count = 0;
  url;

  @ViewChild('marquee') marqueeRef: ElementRef;

  constructor(
    private publicService: PublicService,
    private router: Router,
    private auth: AuthService
  ) {
  }

  ngOnInit(): void {

    this.publicService.updateMarquee();

    this.publicService.getMarguee()
      .subscribe((src) => {

        const url = this.router.url.split('/')[1];

        if (url == AppRoutes.DEPOSIT) {

          this.marquees = src.filter(m => m.type === MarqueeType.deposit);

        } else {

          this.marquees = src.filter(m => m.type === MarqueeType.Hot);

        }

        this.total = this.marquees.length;
        this.showCnt = this.marquees[0];
      });
  }


  next(): void {
    this.count++;

    if (this.count === this.total) {
      this.count = 0;
    }
    this.showCnt = this.marquees[this.count];
  }

  go() {

    this.auth.isLogin().subscribe((boo) => {

      if (boo) {

        this.publicService.isFromClickMarquee = true;
        this.router.navigateByUrl(AppRoutes.LETTER);
      }

    });


  }

  pause() {

    const el = this.marqueeRef.nativeElement;
    el.style.animationPlayState = 'paused';

  }

  play() {
    const el = this.marqueeRef.nativeElement;
    el.style.animationPlayState = 'running';
  }

}
