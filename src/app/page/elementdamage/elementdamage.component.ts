import { VwelementdamageService } from '../../services/vwelementdamage.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-elementdamage',
  templateUrl: './elementdamage.component.html',
  styleUrls: ['./elementdamage.component.css']
})
export class ElementdamageComponent implements OnInit {
  @Input() idaccident: number;
  @Input() idnature: number;
  elementdamages: any[];

  constructor(private service: VwelementdamageService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
 //   console.log('in ed');
    this.service.getByQueryParam({ 'idaccident': this.idaccident, 'idnature': this.idnature })
      .subscribe(elementdamages => {
        this.elementdamages = elementdamages;
    //    console.log('ed = ' + JSON.stringify(this.elementdamages));
      });
  //  console.log('out ed');
  }

}
