import { Component, OnInit } from '@angular/core';
import { questTabs as tabs } from '../app-service/public.service';

@Component({
  selector: 'app-old-quest-center',
  templateUrl: './old-quest-center.component.html',
  // styleUrls: ['./old-quest-center.component.scss']
})
export class OldQuestCenterComponent implements OnInit {

  public tabList: any[] = [
    { tab: tabs.apply, info: 'MEMBER_QUEST.APPLY_TAB' },
    { tab: tabs.applied, info: 'MEMBER_QUEST.APPLIED_TAB' },
    { tab: tabs.recored, info: 'MEMBER_QUEST.RECORD_TAB' },
  ]

  tabs = tabs;
  tab = tabs.apply;

  constructor() { }

  ngOnInit(): void {
  }

  selectType(t): void {

    this.tab = t;

  }

}
