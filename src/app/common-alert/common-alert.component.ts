import { ToastService, ToastType } from './../app-service/toast.service';
import { Component, OnInit } from '@angular/core';
enum AlertMessageType {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}
interface IAlertMessage {
  message: string;
  delay: number;
  type: AlertMessageType;
}
interface ICustomAlertMessage extends IAlertMessage {
  timer: number;
}
@Component({
  selector: 'app-common-alert',
  templateUrl: './common-alert.component.html',
  // styleUrls: ['./common-alert.component.scss']
})
export class CommonAlertComponent implements OnInit {

  ToastType = ToastType;

  // alertMessages: ICustomAlertMessage[] = [];
  alertMessages = [];

  percentMinPrice = 0;
  actPrice = 0;


  constructor(private toastService: ToastService) {

    this.toastService.getMsgs()
      .subscribe((res) => {
        this.alertMessages = res.splice(0);

        // console.log(this.alertMessages);
        const current = this.alertMessages[0];

        if (current && current.type === ToastType.Activity_buy) {
          this.actPrice = this.percentMinPrice = Number(current.percentMinPrice);
        }
      });
  }

  ngOnInit(): void {
  }

  removeAlert(item): void {

    if (item.callback) {

      if (item.type === ToastType.Activity_buy) {

        item.callback(this.actPrice);
        this.actPrice = 0;

      } else {

        item.callback();

      }
    }

    this.alertMessages = this.alertMessages.filter(am => am !== item);
  }

  cancel(item): void {
    item.callback = null;
    this.removeAlert(item);
  }
}
