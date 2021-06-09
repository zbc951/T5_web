import { WalletService } from './../app-service/wallet.service';
import { AppRoutes } from './../constant/routes';
import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { ToastService } from './../app-service/toast.service';
import { LangService } from './../app-service/lang.service';
import { AuthService } from './../app-service/auth.service';


enum Activity_type {
  fixed = 'fixed',
  percent = 'percent'
}

@Component({
  selector: 'app-quest-detail',
  templateUrl: './quest-detail.component.html',
  // styleUrls: ['./quest-detail.component.scss']
})
export class QuestDetailComponent implements OnInit {


  Activity_type = Activity_type;

  @Input() questData: any;
  @Input() thisType: string;
  @Output() lastType = new EventEmitter<string>();
  @Output() buyEvt = new EventEmitter();


  AppRoutes = AppRoutes;


  constructor(

    private walletService: WalletService,
    private toast: ToastService,
    private langService: LangService,
    private auth: AuthService
  ) {

    console.log(this.questData);

  }

  ngOnInit(): void {
    console.log(this.questData);
  }

  goBack(): void {
    this.lastType.emit(this.thisType);
  }

  buy(): void {

    this.buyEvt.emit(this.questData);
  }
}
