import { ToastService } from './../app-service/toast.service';
import { UtilService } from './../app-service/util.service';
import { questTabs, QUEST_VERSION, PublicService } from './../app-service/public.service';
import { LangService } from './../app-service/lang.service';
import { MemberService } from './../app-service/member.service';
import { AppRoutes } from './../constant/routes';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-combine-quest-apply',
  templateUrl: './combine-quest-apply.component.html',
  // styleUrls: ['./combine-quest-apply.component.scss']
})
export class CombineQuestApplyComponent implements OnInit {

  questTabs = questTabs;

  QUEST_VERSION = QUEST_VERSION;
  quest_version;
  isNoList = false;

  pageConfig: {
    itemsPerPage: number,
    currentPage: number,
    totalItems: number,
  } = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: 0,
    };

  questList = [];
  translations;

  num = Number;

  // 不能存轉提
  locked = false;

  @Input() tab: string;

  constructor(
    private memberService: MemberService,
    private langService: LangService,
    public publicService: PublicService,
    private toast: ToastService
  ) {

    this.langService.onloadSub
      .subscribe((boo) => {

        if (boo) {

          this.translations = this.langService.translations;

        }

      });
  }

  ngOnInit(): void {

    // console.log('tab', this.tab);
    this.locked = this.publicService.locked;
    this.getQuestList();

  }

  getQuestList(): void {

    if (this.tab == questTabs.apply) {

      this.memberService.getQuestList()
        .subscribe(this.handdleQuest.bind(this));

    } else if (this.tab == questTabs.applied) {

      this.getQuestListApplied();

    }
  }

  getQuestListApplied() {
    const tmpPaging = {
      page: this.pageConfig.currentPage,
      perPage: this.pageConfig.itemsPerPage
    };

    this.memberService.getQuestListApplied(tmpPaging)
      .subscribe(this.handdleQuest.bind(this));
  }


  handdleQuest(res) {

    const questList = res.data.content;

    if (questList.length > 0) {
      this.isNoList = false;
    }

    if (this.tab == questTabs.applied) {

      this.pageConfig.totalItems = res.data.total;
      this.pageConfig.itemsPerPage = res.data.perPage;
      this.pageConfig.currentPage = res.data.page;

      // console.log('pageConfig', this.pageConfig);

    } else {

      this.pageConfig.totalItems = questList.length;
    }
    // console.log('pageConfig', this.pageConfig);


    questList.forEach((item) => {

      // item.quest_type_name = this.translations.quest_method[item.method];

      if (item.valid_amount == null) {
        item.valid_amount = 0;
      }


      if (item.stages) {
        let stages = JSON.parse(item.stages);

        stages.forEach((el, index) => {

          el.idx = index;
          el.condition.forEach(element => {
            // element.name = this.translations.quest_conditions[element.code];
            element.value = Math.abs(Number(element.value));
          });

          if ((this.quest_version != QUEST_VERSION.COMBINE) && !el.rewardMax) {
            el.rewardMax = el.reward;
          }
        });


        let shift = 0;
        let idx = -1;

        if (item.method == 'before') {

          for (let i = 0; i < stages.length; i++) {

            if (item.review_deposit >= stages[i].amount) {

              idx = i;

            } else {

              idx = i - 1;
              break;
            }

          }

        } else {

          for (let i = 0; i < stages.length; i++) {

            if (item.valid_amount >= stages[i].amount) {

              idx = i;

            } else {

              idx = i - 1;
              break;
            }

          }

        }


        if (stages[idx + 1]) {
          shift = (item.method == 'before') ? (stages[idx + 1].amount - item.review_deposit) : (stages[idx + 1].amount - item.valid_amount);
        }

        // item.reach = idx;
        if (item.stage_index) {

          item.reach = item.stage_index;

        }
        item.shift = shift;


        // item.stagesData = stages;
        let stagesGroup = UtilService.chunk(stages, 6);
        item.stagesGroup = stagesGroup;
      }

      if (item.conditions) {

        item.conditions = JSON.parse(item.conditions);
        item.conditions.forEach(element => {
          // element.name = this.translations.quest_conditions[element.code];
          element.value = Math.abs(Number(element.value));
        });

      }

      if (item.period) {

        item.period = JSON.parse(item.period);
        item.period.name = this.translations.quest_period[item.period.code];
      }


    });

    this.questList = questList;

  }

  applyQuest(item): void {

    this.memberService.applyQuest(item.quest_id, item.detail_id)
      .subscribe(
        (res) => {
          // console.log('res', res);
          item.can_reward = false;
          this.toast.forceAlert(this.translations.MEMBER_QUEST.applied_msg, () => {
            this.getQuestList();
          });
        }
        , (err) => {
          // console.log('err', err);
          this.toast.error(err.error.message, 3000);
        });
  }

  getQuestDetail(item): void {

    // console.log('getQuestDetail', item);

    // item.image_url = 'http://3.113.179.224:8084/upload-files/quest/1602057360GrGSy34Qti6ZRgVxqgvMnVo0sUThcAxHTkcpBKr3.jpeg';

    const cnt = `<img src="${item.image_url}">${item.information}`;
    this.toast.questDetail(cnt);
  }

  pageChanged(event): void {
    this.pageConfig.currentPage = event;

    if (this.tab == questTabs.applied) {
      this.getQuestListApplied();
    }
  }

}
