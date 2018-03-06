import { VwdamageService } from './../../services/vwdamage.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-damage',
  templateUrl: './damage.component.html',
  styleUrls: ['./damage.component.css']
})
export class DamageComponent implements OnInit {
  @Input() idaccident: number;
  @Input() idnature: number;
  @Input() accidentdomain: number;
  damages: any[];

  constructor(private service: VwdamageService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    console.log('d');
    this.service.getByQueryParam({ 'idaccident': this.idaccident, 'idnature': this.idnature,
                                   'accidentdomain': this.accidentdomain })
      .subscribe(damages => {
        this.damages = damages;
        console.log('d = ' + JSON.stringify(this.damages));
      });
    console.log('out d');
  }

}
