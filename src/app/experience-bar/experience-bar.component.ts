import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-experience-bar',
  templateUrl: './experience-bar.component.html',
  // styleUrls: ['./experience-bar.component.scss']
})
export class ExperienceBarComponent implements OnInit {
  @Input() cur: number;
  @Input() goal: number;
  @Input() width: number;
  @Input() height: number;
  style = {
    width:0,
    height:0,
  }
  experience = {
    current: 0,
    goal: 0
  }
  constructor() { }

  ngOnInit(): void {
    this.experience.current = this.cur;
    this.experience.goal = this.goal;
    this.style.width = this.width;
    this.style.height =this.height;
  }

}
