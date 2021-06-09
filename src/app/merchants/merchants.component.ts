// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LangService } from './../app-service/lang.service';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  // styleUrls: ['./merchants.component.scss']
})
export class MerchantsComponent implements OnInit {
  translations;
  mobileImg;

  constructor(private LangService: LangService) {}

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    this.mobileImg = this.LangService.translations.merchants.mobileImg;
  }
}
