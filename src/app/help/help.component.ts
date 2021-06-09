import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '../constant/routes';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  // styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {

  AppRoutes = AppRoutes;
  type: string = 'help';
  file: string = 'register';
  url: string = '';

  public helpList: any[] = [
    { file: 'register', info: 'NEWBIE.OPEN.TITLE' },
    { file: 'deposit', info: 'NEWBIE.DEPOSIT.TITLE' },
    { file: 'withdraw', info: 'NEWBIE.WITHDRAW.TITLE' },
    { file: 'transfer', info: 'NEWBIE.TRANSFER.TITLE' },
    { file: 'preferential', info: 'NEWBIE.PREFERENTIAL.TITLE' },
  ]
  public problemList: any[] = [
    { file: 'common', info: 'COMMON.TITLE' },
    { file: 'remote-assistance', info: 'COMMON.REMOTE.TITLE' },
    // { file: 'contact', info: 'COMMON.CONTACT.TITLE' },
  ]
  public aboutUs: any[] = [
    { file: 'terms', info: 'ABOUT.TERMS.TITLE' },
    { file: 'privacy', info: 'ABOUT.PRIVACY.TITLE' },
    { file: 'duty', info: 'ABOUT.DUTY.TITLE' },
    { file: 'secure', info: 'ABOUT.SECURE.TITLE' },
    { file: 'responsibility', info: 'ABOUT.responsibility.TITLE' },
    { file: 'license', info: 'ABOUT.license.TITLE' },
    { file: 'deposit-withdraw', info: 'ABOUT.depositWithdraw.TITLE' },
    { file: 'rule', info: 'ABOUT.rule.TITLE' },
  ]

  downloadList: any[] = [
    { file: 'allbet', info: 'APP.allbet' },
    { file: 'sa', info: 'APP.sa' },
    { file: 'wm', info: 'APP.wm' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'];
      this.file = params['file'];
      this.url = `${this.type}/${this.file}`;
    });
  }

  public changeFile(file: string) {
    this.file = file;
    this.url = `${this.type}/${this.file}`;
    // console.log('changeFile', this.file, this.url);
    this.router.navigate(['/help'], { queryParams: { type: this.type, file: this.file } });
  }
}
