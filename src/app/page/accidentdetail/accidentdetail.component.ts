import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-accidentdetail',
  templateUrl: './accidentdetail.component.html',
  styleUrls: ['./accidentdetail.component.css']
  /* ,
  changeDetection: ChangeDetectionStrategy.OnPush */
})
export class AccidentdetailComponent implements OnInit {
  @Input() accident: any;

  constructor() { }

  ngOnInit() {
  }

}
