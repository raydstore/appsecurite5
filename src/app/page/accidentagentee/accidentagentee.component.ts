import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-accidentagentee',
  templateUrl: './accidentagentee.component.html',
  styleUrls: ['./accidentagentee.component.css']
})
export class AccidentagenteeComponent implements OnInit {
  @Input() iddamage: number;
  @Input() titlelist: string;
  constructor() { }

  ngOnInit() {
  }

}
