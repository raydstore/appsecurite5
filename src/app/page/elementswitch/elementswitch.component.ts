import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-elementswitch',
  templateUrl: './elementswitch.component.html',
  styleUrls: ['./elementswitch.component.css']
})
export class ElementswitchComponent implements OnInit {
  @Input() iddamage: number;
  @Input() idgrid: number;
  @Input() titlelist: string;
  @Input() accidentdomain: number;
  id: number;
  constructor() { }

  ngOnInit() {
    this.id = this.iddamage;
  }

}
