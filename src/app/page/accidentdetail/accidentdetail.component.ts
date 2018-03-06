import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-accidentdetail',
  templateUrl: './accidentdetail.component.html',
  styleUrls: ['./accidentdetail.component.css']
})
export class AccidentdetailComponent implements OnInit {
  @Input() selectedNatures: string[];
  @Input() idaccident: number;
  constructor() { }

  ngOnInit() {
  }

}
