import { Router } from '@angular/router';
import { PublicService } from './../app-service/public.service';
import { Component, OnInit } from '@angular/core';
import { AppRoutes } from '../constant/routes';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  // styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  AppRoutes = AppRoutes;
  constructor(
    public publicService: PublicService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  goSubPage(url, tab): void {



    this.publicService.tmpSublink = tab;
    this.router.navigateByUrl(url);


  }

}
