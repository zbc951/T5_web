import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
// import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  history = [];

  constructor(
    private router: Router,
    // private auth: AuthService,
    // private eventService: EventService
  ) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {

        // console.log('urlAfterRedirects', urlAfterRedirects);

        const url = urlAfterRedirects.split('/')[1];

        if (urlAfterRedirects.indexOf('popup') == -1) {

          let len = this.history.length;

          if (this.history[len - 1] != urlAfterRedirects) {

            this.history.push(urlAfterRedirects);

          }

        }
      });
  }

  back() {
    console.log('this.history.length', this.history.length);

    if (this.history.length > 0) {

      this.history.pop();
      const last = this.history.length - 1;
      const url = this.history[last];

      if (url) {
        this.router.navigate([url]);
      } else {

        // if (this.auth.getUserData().token) {

        //   this.router.navigateByUrl('lobby');

        // } else {

        //   this.router.navigateByUrl('/');
        // }
      }
    }
  }

}
