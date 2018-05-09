import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-accidentvehicule',
  templateUrl: './accidentvehicule.component.html',
  styleUrls: ['./accidentvehicule.component.css']
})
export class AccidentvehiculeComponent implements OnInit {
  @Input() iddamage: number;
  @Input() idgrid: number;
  @Input() accidentdomain: number;
  @Input() classification: number;
  @Input() titlelist: string;
  
  constructor() { }

  ngOnInit() {
  }

}
