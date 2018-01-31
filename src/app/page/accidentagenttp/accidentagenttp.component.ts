import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-accidentagenttp',
  templateUrl: './accidentagenttp.component.html',
  styleUrls: ['./accidentagenttp.component.css']
})
export class AccidentagenttpComponent implements OnInit {
  @Input() iddamage: number;
  @Input() titlelist: string;
  constructor() { }

  ngOnInit() {
  }

}
