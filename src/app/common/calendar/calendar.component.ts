import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input() date: any;
  @Input() isTime: Boolean;
  @Output() changeDate = new EventEmitter();
  // newDate: Date;
  constructor() { }

  ngOnInit() {
    this.date = new Date(this.date);
  }

  onSelect(event) {
console.log(event);
     this.changeDate.emit(<Date> this.date);
  }

}
