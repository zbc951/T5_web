import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bank-card-record',
  templateUrl: './bank-card-record.component.html',
  // styleUrls: ['./bank-card-record.component.scss']
})
export class BankCardRecordComponent implements OnInit {
  public listData: any;
  public pageConfig: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };

  constructor() { }

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.listData = [];

    for (let i = 0; i < 32; i++) {
      this.listData.push(i);
    }

    this.pageConfig.totalItems = this.listData.count;
  }

  formatBankAccount($account: string): string {
    let $newAccount: any = [];

    if ($account.length > 12) {
      $newAccount.push($account.slice(0, -12));
      $newAccount.push($account.slice(-12, -8));
      $newAccount.push($account.slice(-8, -4));
      $newAccount.push($account.slice(-4));

    } else if ($account.length > 8) {
      $newAccount.push($account.slice(0, -8));
      $newAccount.push($account.slice(-8, -4));
      $newAccount.push($account.slice(-4));

    } else if ($account.length > 4) {
      $newAccount.push($account.slice(0, -4));
      $newAccount.push($account.slice(-4));

    } else {
      $newAccount.push($account);
    }

    return $newAccount.join(' ');
  }

  pageChanged(event) {
    this.pageConfig.currentPage = event;
  }
}
