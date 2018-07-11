import { VwelementgridService } from '../../services/vwelementgrid.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vwelementgrid',
  templateUrl: './vwelementgrid.component.html',
  styleUrls: ['./vwelementgrid.component.css']
})
export class VwelementgridComponent implements OnInit {
  @Input() idaccident: number;
  @Input() idnature: number;
  vwelementgrids: any[];

  constructor(private service: VwelementgridService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getByQueryParam({ 'idnature': this.idnature })
      .subscribe(elementgrids => {
        this.vwelementgrids = elementgrids;
      });
  }

}
