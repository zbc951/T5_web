import { PublicService } from './app-service/public.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from './constant/routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.scss']
})
export class AppComponent {
  AppRoutes = AppRoutes
  constructor(
    private publicService: PublicService,
    public router: Router
  ) {

    this.publicService.init();
    this.publicService.games();
    this.publicService.gameTypes();
    this.publicService.updateCarousel();
    this.publicService.updateMarquee();

    setInterval(() => {
      this.publicService.updateCarousel();
      this.publicService.updateMarquee();
    }, 60000);

  }

  onActivate(event) {
    window.scroll(0, 0);
  }
}
