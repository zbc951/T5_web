import { ToastService } from './../app-service/toast.service';
import { PublicService } from './../app-service/public.service';
import { MemberService } from './../app-service/member.service';
import { LangService, lang } from './../app-service/lang.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DayjsService, timeFormat } from './../app-service/dayjs.service';

@Component({
  selector: 'app-quest-record',
  templateUrl: './quest-record.component.html',
  // styleUrls: ['./quest-record.component.scss']
})
export class QuestRecordComponent implements OnInit {

  locale = 'zh';
  questRecord = [];
  form;
  daterangepicker = new FormControl('');
  pageConfig: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };

  selectReview = new FormControl();
  statusTxt;

  translations;
  isNoRecord = true;

  constructor(
    private langService: LangService,
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private toast: ToastService,
    private publicService: PublicService
  ) {

    this.langService.onloadSub
      .subscribe((boo) => {

        if (boo) {

          this.translations = this.langService.translations;

          const REVIEW_STATUS = this.translations.REVIEW_STATUS;

          this.statusTxt = {
            // '': '全部',
            pending: REVIEW_STATUS.PENDING,
            review: REVIEW_STATUS.REVIEW,
            approved: REVIEW_STATUS.APPROVED,
            disapproved: REVIEW_STATUS.DISAPPROVED,
            cancel: REVIEW_STATUS.CANCEL
          };


          const l = this.langService.lang_now;
          switch (l) {
            case lang.zhHant:
            case lang.zhHans:
              this.locale = 'zh';
              break;
            case lang.en:
              this.locale = 'en';
              break;
            case lang.jp:
              this.locale = 'ja';
              break;

          }

        }

      });

    this.form = this.formBuilder.group({
      status: '',
      start_at: '',
      end_at: '',
    });
  }

  ngOnInit(): void {
  }

  getQuestRecord(): void {

    const formdata = Object.assign({}, this.form.value);
    const period = this.daterangepicker.value;

    formdata.start_at = DayjsService.getDayjsObj(period[0], timeFormat);
    formdata.end_at = DayjsService.getDayjsObj(period[1], timeFormat);

    this.memberService.getQuestRecord(formdata)
      .subscribe(
        (res) => {

          if (res.length) {

            let questRecord = res;

            if (questRecord.length > 0) {
              this.isNoRecord = false;
            } else {
              this.isNoRecord = true;
            }

            questRecord.forEach((item, index) => {
              for (const key in item) {
                if (item.hasOwnProperty(key)) {
                  const element = item[key];
                  if (element == null || element == '') {
                    item[key] = '-';
                  }

                  if (key == 'status') {
                    item[key] = this.statusTxt[item['status']];
                  }
                }
              }

            });

            this.questRecord = questRecord;

          } else {
            this.questRecord = [];
            this.isNoRecord = true;
          }


        },
        (err) => {
          this.toast.error(err);
        }
      );





  }

  setTime(evt): void {

    this.daterangepicker.patchValue([
      new Date(evt.start),
      new Date(evt.end)
    ]);

  }

}
