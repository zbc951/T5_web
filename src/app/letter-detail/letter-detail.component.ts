import { AppRoutes } from './../constant/routes';
import { Router } from '@angular/router';
import { LetterService } from './../app-service/letter.service';
import { Component, OnInit } from '@angular/core';
import { tabs } from './../letter/letter.component';


enum pageBtns {
  prev,
  next
}

@Component({
  selector: 'app-letter-detail',
  templateUrl: './letter-detail.component.html',
  // styleUrls: ['./letter-detail.component.scss']
})
export class LetterDetailComponent implements OnInit {

  tabs = tabs;
  AppRoutes = AppRoutes;
  pageBtns = pageBtns;
  data;
  detail;
  type = tabs.msg;

  constructor(
    private letterService: LetterService,
    private router: Router
  ) {

    this.data = this.letterService.tmpMsg;
    console.log(this.data);

    if (!this.data) {

      this.router.navigateByUrl(AppRoutes.LETTER);

    } else {

      // message
      if (this.data.isRead !== undefined) {

        this.type = tabs.msg;

        this.getMsgDetail(this.data.id);

      } else {

        this.type = tabs.announce;

        // announce

        this.getAnnounceDetail(this.data.id);


      }

    }

  }

  ngOnInit(): void {
  }

  changePage(btntype): void {

    const id = (btntype === pageBtns.prev) ? this.detail.prev : this.detail.next;

    if (!id) {
      return;
    }


    if (this.type === tabs.msg) {

      this.getMsgDetail(id);

    } else {

      this.getAnnounceDetail(id);


    }


  }

  removeMessage(): void {

    this.letterService.remove([this.data.id])
      .subscribe(
        (res) => {
          this.router.navigateByUrl(AppRoutes.LETTER);
        }, (err) => {

          console.log(err);
        }
      );
  }


  getMsgDetail(id): void {
    this.letterService.getMsgDetail(id)
      .subscribe((res) => {

        this.data = res;
        this.detail = res;

      });
  }

  getAnnounceDetail(id): void {
    this.letterService.getAnnounceDetail(id)
      .subscribe((res) => {

        this.data = res;
        this.detail = res;

      });
  }

}
