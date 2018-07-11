import { BitclassService } from '../../services/bitclass.service';
import { AccidentagentshbitService } from '../../services/accidentagentshbit.service';
import { Component, OnInit, Input } from '@angular/core';
import { Vw$accidentagentshbitService } from '../../services/vw$accidentagentshbit.service';
import { Vw$accidentagentshbit } from '../../table/table';

@Component({
  selector: 'app-accidentagentshbit',
  templateUrl: './accidentagentshbit.component.html',
  styleUrls: ['./accidentagentshbit.component.css']
})
export class AccidentagentshbitComponent implements OnInit {
  @Input() iddamage: number;
  @Input() idagent:  string;
  @Input() idgrid: number;
  vw$accidentagentshbits: Vw$accidentagentshbit[];
  bitclasss: any[];

  constructor(private service: Vw$accidentagentshbitService,
     private accidentagentshbitService: AccidentagentshbitService, private bitclassService: BitclassService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getByQueryParam({ 'iddamage': this.iddamage, 'idagent': this.idagent, 'idgrid': this.idgrid })
      .subscribe(vw$accidentagentshbits => {
        this.vw$accidentagentshbits = vw$accidentagentshbits;
      });
  }

  newNature() {

  }

  newSiege() {

  }

  newForme() {

  }

  newMateriel() {

  }

}
